import React, { useEffect, useState, useRef } from "react";

const OrderbookAnalyzer = () => {
  const [topCoins, setTopCoins] = useState([]);
  const dataRef = useRef({});
  const intervalRef = useRef(null);
  const streamRef = useRef({});

  // Coin symbols (top coins only, spot market only)
  const symbols = [
    "btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt",
    "xrpusdt", "dogeusdt", "maticusdt", "ltcusdt", "linkusdt"
  ];

  useEffect(() => {
    // Connect WebSocket for each symbol
    symbols.forEach((symbol) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth10@100ms`);
      streamRef.current[symbol] = ws;

      ws.onmessage = (event) => {
        const { bids, asks } = JSON.parse(event.data);
        const totalBuy = bids.reduce((sum, [price, qty]) => sum + parseFloat(price) * parseFloat(qty), 0);
        const totalSell = asks.reduce((sum, [price, qty]) => sum + parseFloat(price) * parseFloat(qty), 0);

        const now = Date.now();
        const entry = { time: now, buy: totalBuy, sell: totalSell };

        if (!dataRef.current[symbol]) {
          dataRef.current[symbol] = [];
        }

        // Push current entry and clean up old entries > 5m
        dataRef.current[symbol].push(entry);
        dataRef.current[symbol] = dataRef.current[symbol].filter((d) => now - d.time <= 300000);
      };
    });

    // Update UI every 1s
    intervalRef.current = setInterval(() => {
      const stats = [];
      for (const symbol of symbols) {
        const data = dataRef.current[symbol] || [];
        if (data.length < 10) continue; // skip coin with not enough data

        const totalBuy = data.reduce((sum, d) => sum + d.buy, 0);
        const totalSell = data.reduce((sum, d) => sum + d.sell, 0);
        const ratio = totalSell > 0 ? totalBuy / totalSell : 0;

        stats.push({ symbol, totalBuy, totalSell, ratio });
      }

      const sorted = stats.sort((a, b) => b.ratio - a.ratio).slice(0, 10);
      setTopCoins(sorted);
    }, 1000);

    return () => {
      // Cleanup on unmount
      Object.values(streamRef.current).forEach((ws) => ws.close());
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-4 text-gray-900">
      <h2 className="text-xl font-bold mb-4">📈 Top 10 Coin BUY/SELL Ratio (5 Menit)</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left">Coin</th>
              <th className="px-2 py-1 text-right">Total Buy (5m)</th>
              <th className="px-2 py-1 text-right">Total Sell (5m)</th>
              <th className="px-2 py-1 text-right">Buy/Sell Ratio</th>
            </tr>
          </thead>
          <tbody>
            {topCoins.map((coin) => (
              <tr key={coin.symbol} className="border-b">
                <td className="px-2 py-1 font-medium uppercase">{coin.symbol}</td>
                <td className="px-2 py-1 text-right">{coin.totalBuy.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="px-2 py-1 text-right">{coin.totalSell.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="px-2 py-1 text-right">{coin.ratio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderbookAnalyzer;