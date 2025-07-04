import React from "react";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <div className="bg-gray-800 h-14 w-full" />

      {/* Main area: sidebar + konten */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="bg-gray-900 text-white w-48 flex flex-col justify-between p-4">
          <div className="flex flex-col space-y-4">
            <Link to="/aset" className="hover:text-yellow-400">Semua Aset</Link>
            <Link to="/orderbook">Orderbook Realtime</Link>
            <Link to="/volume" className="hover:text-yellow-400">Volume</Link>
            <Link to="/volatilitas" className="hover:text-yellow-400">Volatilitas</Link>
            <Link to="/antrian" className="hover:text-yellow-400">Antrian</Link>
            <Link to="/sinyal" className="hover:text-yellow-400">Sinyal</Link>
          </div>
          <div className="text-xs text-gray-400 mt-4">
            Created by Dizon
          </div>
        </nav>

        {/* Konten utama */}
        <main className="flex-1 p-4 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
