import React, { useEffect, useState } from "react";
import axios from "axios";

const AllAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "idr",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          sparkline: false,
        },
      })
      .then((res) => {
        setAssets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading data aset kripto...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Daftar Aset Kripto (CoinGecko)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((coin) => (

            <div
    key={coin.id}
    className="transition-transform transform hover:scale-105"
  >
    <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200 flex flex-col hover:shadow-xl transition duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-6 h-6" />
          <div className="font-semibold">{coin.name}</div>
        </div>
        <div className="text-sm text-gray-500">
          {coin.symbol.toUpperCase()}
        </div>
      </div>

      <div className="mt-4 text-lg font-bold text-gray-800">
        Rp {coin.current_price.toLocaleString("id-ID")}
      </div>

      <div className="text-sm text-gray-600 mt-1">
        Volume: Rp {coin.total_volume.toLocaleString("id-ID")}
      </div>

      <div
        className={`mt-2 text-sm font-medium ${
          coin.price_change_percentage_24h >= 0
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {coin.price_change_percentage_24h?.toFixed(2)}%
      </div>
    </div>
  </div>
        ))}
      </div>
    </div>
  );
};

export default AllAssetsPage;
