import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Table1 = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTopVolatileCoins = async () => {
      try {
        const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        const sorted = res.data
          .sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
          .slice(0, 10);

        setCoins(sorted);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchTopVolatileCoins();
  }, []);

  return (
    <div>
      <h2>Top 10 Coin Volatilitas Tertinggi (24 Jam)</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Coin</th>
            <th>Volatilitas (%)</th>
            <th>Harga Terakhir</th>
            <th>Volume 24 Jam</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.symbol}>
              <td>{index + 1}</td>
              <td>{coin.symbol}</td>
              <td>{parseFloat(coin.priceChangePercent).toFixed(2)}%</td>
              <td>${parseFloat(coin.lastPrice).toFixed(2)}</td>
              <td>{parseFloat(coin.volume).toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table1;