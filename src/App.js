import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        setCoins(res.data);
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // update tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔥 Binance Realtime Market</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.symbol}>
              <td>{coin.symbol}</td>
              <td>{parseFloat(coin.lastPrice).toFixed(6)}</td>
              <td>{parseFloat(coin.volume).toFixed(0)}</td>
              <td>{parseFloat(coin.priceChangePercent).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
