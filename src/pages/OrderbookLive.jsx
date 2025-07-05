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
    setTimeout(() => window.location.reload(), 5000); // bisa diganti reconnect logic
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
