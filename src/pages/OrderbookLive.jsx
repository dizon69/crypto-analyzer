import React, { useEffect, useState, useRef } from "react";

const symbols = [
  "btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt",
  "xrpusdt", "dogeusdt", "maticusdt", "ltcusdt", "linkusdt"
];

const OrderbookLive = () => {
  const [orderbookData, setOrderbookData] = useState({});
  const wsRef = useRef({});
  const prevBidsRef = useRef({});

  useEffect(() => {
    console.log("WebSocket initializing...");
    symbols.forEach((symbol) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth10@100ms`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const currentBids = data.bids || [];
        const currentAsks = data.asks || [];

        const totalBuy = currentBids.reduce(
          (acc, [price, qty]) => acc + parseFloat(price) * parseFloat(qty),
          0
        );
        const totalSell = currentAsks.reduce(
          (acc, [price, qty]) => acc + parseFloat(price) * parseFloat(qty),
          0
        );

        // Anti-spoofing
        const prevBids = prevBidsRef.current[symbol] || [];
        const prevTotalBuy = prevBids.reduce(
          (acc, [price, qty]) => acc + parseFloat(price) * parseFloat(qty),
          0
        );
        const diff = Math.abs(totalBuy - prevTotalBuy);
        const diffPercent = (diff / (prevTotalBuy || 1)) * 100;
        const isSpoofing = diffPercent > 40;

        if (!isSpoofing) {
          setOrderbookData((prev) => ({
            ...prev,
            [symbol]: {
              totalBuy,
              totalSell,
              bids: currentBids,
              asks: currentAsks
            }
          }));
        }

        prevBidsRef.current[symbol] = currentBids;
      };

      wsRef.current[symbol] = ws;
    });

    return () => {
      symbols.forEach((symbol) => {
        if (wsRef.current[symbol]) {
          wsRef.current[symbol].close();
        }
      });
    };
  }, []);

  const sortedData = Object.entries(orderbookData)
    .sort(([, a], [, b]) => b.totalBuy - a.totalBuy)
    .slice(0, 10);

  return (
    <div className="p-4 text-gray-900">
      <h2 className="text-xl font-bold mb-4">📊 Top 10 Antrian Beli (Realtime, Anti-Spoofing)</h2>
      {sortedData.map(([symbol, data]) => {
        const total = data.totalBuy + data.totalSell;
        const buyPercent = ((data.totalBuy / total) * 100).toFixed(1);
        const sellPercent = ((data.totalSell / total) * 100).toFixed(1);

        return (
          <div key={symbol} className="mb-4">
            <div className="font-semibold uppercase mb-1">{symbol}</div>
            <div className="w-full h-4 bg-gray-200 rounded overflow-hidden flex">
              <div
                className="bg-green-500 h-4"
                style={{ width: `${buyPercent}%` }}
              ></div>
              <div
                className="bg-red-500 h-4"
                style={{ width: `${sellPercent}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-700 mt-1 flex justify-between">
              <span>Buy: {buyPercent}%</span>
              <span>Sell: {sellPercent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderbookLive;
