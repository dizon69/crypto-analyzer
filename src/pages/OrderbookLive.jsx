import React, { useEffect, useState, useRef } from "react";

const symbols = [
  "btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt",
  "xrpusdt", "dogeusdt", "maticusdt", "ltcusdt", "linkusdt"
];

const OrderbookLive = () => {
  const [buyData, setBuyData] = useState({});
  const wsRef = useRef({});
  const prevBidsRef = useRef({});

  useEffect(() => {
    symbols.forEach((symbol) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth10@100ms`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const currentBids = data.bids;
        const prevBids = prevBidsRef.current[symbol] || [];

        // Hitung total buy
        const totalBuy = currentBids.reduce(
          (acc, [price, qty]) => acc + parseFloat(price) * parseFloat(qty),
          0
        );

        // Deteksi spoofing: perubahan volume besar dalam 1 detik
        const prevTotalBuy = prevBids.reduce(
          (acc, [price, qty]) => acc + parseFloat(price) * parseFloat(qty),
          0
        );
        const volumeDiff = Math.abs(totalBuy - prevTotalBuy);
        const volumeChangePercent = (volumeDiff / (prevTotalBuy || 1)) * 100;

        const isSpoofing = volumeChangePercent > 40; // ambang batas 40%

        if (!isSpoofing) {
          setBuyData((prev) => ({
            ...prev,
            [symbol]: {
              totalBuy,
              bids: currentBids
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

  const sortedData = Object.entries(buyData)
    .sort(([, a], [, b]) => b.totalBuy - a.totalBuy)
    .slice(0, 10);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Top 10 Antrian Beli (Realtime, Anti-Spoofing)</h2>
      {sortedData.map(([symbol, data]) => (
        <div key={symbol} className="mb-2">
          <div className="font-medium uppercase mb-1">{symbol}</div>
          <div className="w-full h-4 bg-gray-200 rounded">
            <div
              className="h-4 bg-green-500 rounded"
              style={{ width: `${Math.min(data.totalBuy / sortedData[0][1].totalBuy * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            Total Buy: ${data.totalBuy.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderbookLive;