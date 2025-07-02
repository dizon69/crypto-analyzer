import React from 'react';

const dummyData = [
  { name: 'Bitcoin', buyOrders: 1234567, volatility: '5.2%', volume: '$90,000,000' },
  { name: 'Ethereum', buyOrders: 987654, volatility: '3.8%', volume: '$70,000,000' },
  { name: 'BNB', buyOrders: 456123, volatility: '4.1%', volume: '$50,000,000' },
  { name: 'Solana', buyOrders: 321000, volatility: '6.9%', volume: '$45,000,000' },
  { name: 'XRP', buyOrders: 290000, volatility: '2.5%', volume: '$30,000,000' },
  { name: 'Cardano', buyOrders: 275000, volatility: '3.0%', volume: '$28,000,000' },
  { name: 'Dogecoin', buyOrders: 270000, volatility: '4.7%', volume: '$25,000,000' },
  { name: 'Avalanche', buyOrders: 250000, volatility: '3.9%', volume: '$22,000,000' },
  { name: 'Polkadot', buyOrders: 240000, volatility: '3.1%', volume: '$21,000,000' },
  { name: 'Litecoin', buyOrders: 230000, volatility: '2.8%', volume: '$20,000,000' },
];

const Table1 = () => {
  return (
    <div>
      <h2>Top 10 Coin - Informasi Market</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Coin</th>
            <th>Antrian Beli 24 Jam</th>
            <th>Volatilitas 24 Jam</th>
            <th>Volume 3 Bulan</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((coin, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{coin.name}</td>
              <td>{coin.buyOrders.toLocaleString()}</td>
              <td>{coin.volatility}</td>
              <td>{coin.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table1;
