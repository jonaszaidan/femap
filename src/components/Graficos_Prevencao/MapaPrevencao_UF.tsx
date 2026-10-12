"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaPrevencao_UF() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={[-14.235, -51.9253]} // Centro do Brasil
        zoom={4}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}