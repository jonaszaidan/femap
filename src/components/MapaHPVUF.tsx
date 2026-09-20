"use client";

import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface HPV {
  uf: string;
  cobertura: number;
}

export default function MapaHPVUF({
  dados,
}: {
  dados: HPV[];
}) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    fetch("/mapas/Brasil-Estados.geojson")
      .then((res) => res.json())
      .then((data) => setGeojson(data));
  }, []);

  const mediaPorUF = dados.reduce(
    (acc: any, item: any) => {
      if (!acc[item.uf]) {
        acc[item.uf] = {
          total: 0,
          count: 0,
        };
      }

      acc[item.uf].total += Number(item.cobertura);
      acc[item.uf].count += 1;

      return acc;
    },
    {}
  );

  const getCobertura = (uf: string) => {
    const info = mediaPorUF[uf];

    if (!info) return null;

    return info.total / info.count;
  };

  const getColor = (cobertura: number | null) => {
    if (cobertura === null) {
      return "#d1d5db";
    }

    if (cobertura >= 80) {
      return "#22c55e";
    }

    if (cobertura >= 70) {
      return "#facc15";
    }

    return "#ef4444";
  };

  const style = (feature: any) => {
    const uf =
      feature.properties.sigla ||
      feature.properties.uf ||
      feature.properties.name;

    const cobertura = getCobertura(uf);

    return {
      fillColor: getColor(cobertura),
      weight: 1,
      opacity: 1,
      color: "#ffffff",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (
    feature: any,
    layer: any
  ) => {
    const uf =
      feature.properties.sigla ||
      feature.properties.uf ||
      feature.properties.name;

    const cobertura = getCobertura(uf);

    layer.bindPopup(`
      <strong>${uf}</strong>
      <br/>
      Cobertura HPV:
      ${
        cobertura
          ? cobertura.toFixed(1) + "%"
          : "Sem dados"
      }
    `);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Cobertura HPV por Estado
      </h2>

      <MapContainer
        center={[-15, -55]}
        zoom={4}
        style={{
          height: "400px",
          width: "100%",
        }}
      >
      
        {geojson && (
          <GeoJSON
            data={geojson}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}