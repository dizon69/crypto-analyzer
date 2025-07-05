import React, { useEffect, useRef, useState } from "react";

const symbols = [
  "btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt",
  "xrpusdt", "dogeusdt", "maticusdt", "ltcusdt", "linkusdt"
];

const OrderbookAnalyzer = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recentAlertCoins, setRecentAlertCoins] = useState([]);
  const dataRef = useRef({});
  const intervalRef = useRef(null);

  useEffect(() => {
    const streams = symbols.map((s) => `${s}@depth10@100ms`).join("/");
    const socket = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    socket.onopen = () => {
      console.log("WebSocket connected.");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.warn("WebSocket closed. Reconnecting in 5s...");
      setTimeout(() => window.location.reload(), 5000);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { stream, data } = message;
      const symbol = stream.split("@")[0];
      const { bids, asks } = data;

      const totalBuy = bids.reduce((sum, [price, qty]) => sum + parseFloat(price) * parseFloat(qty), 0);
      const totalSell = asks.reduce((sum, [price, qty]) => sum + parseFloat(price) * parseFloat(qty), 0);
      const now = Date.now();
      const entry = { time: now, buy: totalBuy, sell: totalSell };

      if (!dataRef.current[symbol]) {
        dataRef.current[symbol] = [];
      }

      dataRef.current[symbol].push(entry);
      dataRef.current[symbol] = dataRef.current[symbol]
        .filter((d) => now - d.time <= 300000)
        .slice(-300);
    };

    intervalRef.current = setInterval(() => {
      const stats = [];
      const updatedAlerts = [];
      const newAlertedCoins = [];

      for (const symbol of symbols) {
        const data = dataRef.current[symbol] || [];
        if (data.length < 10) continue;

        const totalBuy = data.reduce((sum, d) => sum + d.buy, 0);
        const totalSell = data.reduce((sum, d) => sum + d.sell, 0);
        const ratio = totalSell > 0 ? totalBuy / totalSell : 0;

        const volumeUSD = totalBuy + totalSell;
        if (volumeUSD < 1_000_000) continue;

        const lastRatio = topCoins.find((c) => c.symbol === symbol)?.ratio || 0;
        if (lastRatio > 0 && ratio > lastRatio * 2) {
          updatedAlerts.push(`🔥 ${symbol.toUpperCase()} Buy/Sell Ratio Naik 2x! (${lastRatio.toFixed(2)} → ${ratio.toFixed(2)})`);
          newAlertedCoins.push(symbol);
        }

        stats.push({ symbol, totalBuy, totalSell, ratio });
      }

      setAlerts((prev) => [...updatedAlerts, ...prev].slice(0, 5));
      setRecentAlertCoins(newAlertedCoins);
      const sorted = stats.sort((a, b) => b.ratio - a.ratio).slice(0, 10);
      setTopCoins(sorted);
    }, 1000);

    return () => {
      socket.close();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-4 text-gray-900">
      <h2 className="text-xl font-bold mb-4">📈 Top 10 Coin BUY/SELL Ratio (5 Menit)</h2>

      {alerts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-4">
          {alerts.map((alert, idx) => (
            <div key={idx}>⚠️ {alert}</div>
          ))}
        </div>
      )}

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
            {topCoins.map((coin) => {
              const total = coin.totalBuy + coin.totalSell;
              const buyPercent = ((coin.totalBuy / total) * 100).toFixed(1);
              const sellPercent = ((coin.totalSell / total) * 100).toFixed(1);

              return (
                <tr key={coin.symbol} className="border-b">
                  <td className="px-2 py-1 font-medium uppercase">
                    {coin.symbol}
                    {recentAlertCoins.includes(coin.symbol) && <span className="ml-1 text-red-500">🔥</span>}
                  </td>
                  <td className="px-2 py-1 text-right">{coin.totalBuy.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-2 py-1 text-right">{coin.totalSell.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-2 py-1 text-right">{coin.ratio.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderbookAnalyzer;
