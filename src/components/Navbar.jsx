// components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-around font-semibold">
      <NavLink to="/volume" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>📊 Volume</NavLink>
      <NavLink to="/volatilitas" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>📈 Volatilitas</NavLink>
      <NavLink to="/antrian" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>📥 Antrian Beli</NavLink>
      <NavLink to="/sinyal" className={({ isActive }) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>💡 Sinyal Beli</NavLink>
    </nav>
  );
}