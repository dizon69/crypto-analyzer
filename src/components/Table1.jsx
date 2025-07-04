// src/components/Table1.jsx
import React from "react";

const Table1 = () => {
  const data = [
    { name: "Bitcoin", volume: "25B" },
    { name: "Ethereum", volume: "18B" },
    { name: "Solana", volume: "7B" },
    { name: "BNB", volume: "5B" },
    { name: "XRP", volume: "4.5B" },
    { name: "Cardano", volume: "4B" },
    { name: "Dogecoin", volume: "3.2B" },
    { name: "Avalanche", volume: "3B" },
    { name: "Polkadot", volume: "2.5B" },
    { name: "Litecoin", volume: "2.3B" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Volume 24 Jam</h2>
      <table className="w-full text-left border border-gray-200 text-green-600">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{coin.name}</td>
              <td className="p-2 border">{coin.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table1;