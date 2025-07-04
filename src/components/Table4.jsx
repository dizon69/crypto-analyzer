// src/components/Table4.jsx
import React from "react";

const Table4 = () => {
  const data = [
    { name: "Bitcoin", signal: "Beli" },
    { name: "Ethereum", signal: "Tunggu" },
    { name: "Solana", signal: "Beli" },
    { name: "Dogecoin", signal: "Jual" },
    { name: "Cardano", signal: "Beli" },
    { name: "XRP", signal: "Tunggu" },
    { name: "Litecoin", signal: "Beli" },
    { name: "Shiba Inu", signal: "Jual" },
    { name: "BNB", signal: "Beli" },
    { name: "Polkadot", signal: "Tunggu" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Sinyal Beli (Indikator Teknikal)</h2>
      <table className="w-full text-left border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Coin</th>
            <th className="p-2 border">Sinyal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{coin.name}</td>
              <td className="p-2 border">{coin.signal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table4;
