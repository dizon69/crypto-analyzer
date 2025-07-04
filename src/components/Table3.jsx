// src/components/Table3.jsx
import React from "react";

const Table3 = () => {
  const data = [
    { name: "Bitcoin", orders: 22000 },
    { name: "Ethereum", orders: 18000 },
    { name: "Solana", orders: 14000 },
    { name: "Dogecoin", orders: 12000 },
    { name: "Shiba Inu", orders: 11000 },
    { name: "XRP", orders: 9500 },
    { name: "Cardano", orders: 9100 },
    { name: "BNB", orders: 8800 },
    { name: "Litecoin", orders: 7700 },
    { name: "Polkadot", orders: 7400 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Top 10 Antrian Beli 24 Jam</h2>
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Antrian Beli</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{coin.name}</td>
              <td className="p-2 border">{coin.orders.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table3;
