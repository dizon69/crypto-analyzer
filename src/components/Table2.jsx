// src/components/Table2.jsx
import React from "react";

const Table2 = () => {
  const data = [
    { name: "Solana", volatility: "12.4%" },
    { name: "Dogecoin", volatility: "11.8%" },
    { name: "Shiba Inu", volatility: "10.7%" },
    { name: "Avalanche", volatility: "9.9%" },
    { name: "Ethereum", volatility: "8.3%" },
    { name: "Bitcoin", volatility: "7.5%" },
    { name: "Polkadot", volatility: "7.1%" },
    { name: "Cardano", volatility: "6.8%" },
    { name: "XRP", volatility: "6.5%" },
    { name: "Litecoin", volatility: "6.1%" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Volatilitas 24 Jam</h2>
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Volatilitas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{coin.name}</td>
              <td className="p-2 border">{coin.volatility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table2;