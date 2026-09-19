"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Indicador {
  id: number;
  municipio: string;
  mortalidade: number;
  vacinacao_hpv: number;
  rastreamento: number;
  latitude: number;
  longitude: number;
}

export default function MapaMunicipios({
  dados,
  titulo,
}: {
  dados: Indicador[];
  titulo: string;
})
{
  const getColor = (mortalidade: number) => {
    if (mortalidade < 3) return "#22c55e";
    if (mortalidade <= 4.5) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
     <h2 className="text-xl font-bold mb-4">
           {titulo}
    </h2>

      <MapContainer
        center={[-18.5, -44]}
        zoom={6}
        style={{
        height: "400px",
        width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dados.map((item) => (
          <CircleMarker
            key={item.id}
            center={[
                Number(item.latitude),
                Number(item.longitude),
            ]}
            radius={Math.max(
                Number(item.mortalidade) * 3,
            8
            )}
            
           >
            <Popup>
              <strong>{item.municipio}</strong>

              <br />

              Mortalidade: {item.mortalidade}

              <br />

                Risco:
                {
                    item.mortalidade < 3
                        
                        ? " 🟢 Baixo"
                        
                        : item.mortalidade <= 4.5
                        
                        ? " 🟡 Médio"
                        
                        : " 🔴 Alto"
                }
              <br />

              Rastreamento: {item.rastreamento}%
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}