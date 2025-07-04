import React, { useEffect, useState, useRef } from "react";

const OrderbookAnalyzer = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const dataRef = useRef({});
  const intervalRef = useRef(null);
  const streamRef = useRef({});
  const reconnectingRef = useRef({});

  const symbols = [
    "btcusdt", "ethusdt", "bnbusdt", "solusdt", "adausdt",
    "xrpusdt", "dogeusdt", "maticusdt", "ltcusdt", "linkusdt"
  ];

  useEffect(() => {
    symbols.forEach((symbol) => {
      const connect = () => {
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth10@100ms`);
        streamRef.current[symbol] = ws;

        ws.onopen = () => {
          console.log(`${symbol} WebSocket connected.`);
          reconnectingRef.current[symbol] = false;
        };

        ws.onerror = () => {
          console.error(`${symbol} WebSocket error.`);
          if (!reconnectingRef.current[symbol]) {
            reconnectingRef.current[symbol] = true;
            setTimeout(connect, 5000); // delay reconnect
          }
        };

        ws.onclose = () => {
          console.warn(`${symbol} WebSocket closed.`);
          if (!reconnectingRef.current[symbol]) {
            reconnectingRef.current[symbol] = true;
            setTimeout(connect, 5000); // delay reconnect
          }
        };

        ws.onmessage = (event) => {
          const { bids, asks } = JSON.parse(event.data);
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
            .slice(-300); // keep only last 300 entries (1 entry per second)
        };
      };

      connect();
    });

    intervalRef.current = setInterval(() => {
      const stats = [];
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
          setAlerts((prev) => [
            `🔥 ${symbol.toUpperCase()} Buy/Sell Ratio Naik 2x! (${lastRatio.toFixed(2)} → ${ratio.toFixed(2)})`,
            ...prev.slice(0, 4)
          ]);
        }

        stats.push({ symbol, totalBuy, totalSell, ratio });
      }

      const sorted = stats.sort((a, b) => b.ratio - a.ratio).slice(0, 10);
      setTopCoins(sorted);
    }, 1000);

    return () => {
      Object.values(streamRef.current).forEach((ws) => ws.close());
      clearInterval(intervalRef.current);
    };
  }, []); // Hapus dependency topCoins

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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">📊 Buy vs Sell Chart</h3>
        {topCoins.map((coin) => {
          const total = coin.totalBuy + coin.totalSell;
          const buyPercent = ((coin.totalBuy / total) * 100).toFixed(1);
          const sellPercent = ((coin.totalSell / total) * 100).toFixed(1);

          return (
            <div key={coin.symbol} className="mb-4">
              <div className="font-medium uppercase mb-1">{coin.symbol}</div>
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
    </div>
  );
};

export default OrderbookAnalyzer;