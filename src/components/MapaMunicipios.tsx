"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface DadosMapa {
  id: number;
  municipio: string;
  latitude: number;
  longitude: number;
  mortalidade?: number;
  cobertura?: number;
  rastreamento?: number;
}

export default function MapaMunicipios({
  dados,
  titulo,
  metrica,
}: {
  dados: DadosMapa[];
  titulo: string;
  metrica: string;
}) {

  const getValor = (item: any) => {
    return Number(item[metrica]) || 0;
  };

  const getColor = (valor: number) => {

    if (metrica === "mortalidade") {
      if (valor < 3) return "#22c55e";
      if (valor <= 4.5) return "#facc15";
      return "#ef4444";
    }

    if (metrica === "cobertura") {
      if (valor >= 80) return "#22c55e";
      if (valor >= 70) return "#facc15";
      return "#ef4444";
    }

    return "#3b82f6";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">

      <h2 className="text-xl font-bold mb-4">
        {titulo}
      </h2>

        <MapContainer
      center={[-15, -55]}
      zoom={4}
      zoomControl={false}
      attributionControl={false}
      style={{
        height: "400px",
        width: "100%",
        background: "#f8fafc",
      }}
    >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dados.map((item) => {

          const valor = getValor(item);

          return (
            <CircleMarker
              key={item.id}
              center={[
                Number(item.latitude),
                Number(item.longitude),
              ]}
              radius={Math.max(valor / 5, 8)}
              pathOptions={{
                color: getColor(valor),
                fillColor: getColor(valor),
                fillOpacity: 0.8,
              }}
            >
              <Popup>

                <strong>{item.municipio}</strong>

                <br />

                {metrica === "mortalidade" && (
                  <>
                    Mortalidade: {item.mortalidade}
                  </>
                )}

                {metrica === "cobertura" && (
                  <>
                    Cobertura HPV: {item.cobertura}%
                  </>
                )}

              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

    </div>
  );
}