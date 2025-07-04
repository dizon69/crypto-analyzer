import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import VolumePage from "./pages/VolumePage";
import VolatilitasPage from "./pages/VolatilitasPage";
import AntrianPage from "./pages/AntrianPage";
import SinyalPage from "./pages/SinyalPage";
import AllAssetsPage from "./pages/AllAssetsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="volume" element={<VolumePage />} />
        <Route path="volatilitas" element={<VolatilitasPage />} />
        <Route path="antrian" element={<AntrianPage />} />
        <Route path="sinyal" element={<SinyalPage />} />
        <Route path="aset" element={<AllAssetsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
