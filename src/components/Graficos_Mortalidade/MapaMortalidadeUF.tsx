"use client";

import {
  MapContainer,
  GeoJSON,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MortalidadeUF {
  uf: string;
  estado: string;
  ano: number;
  tx_mortalidade_ccu: number;
}

interface Props {
  mortalidadeUFAno: MortalidadeUF[];
}

export default function MapaMortalidadeUF({
  mortalidadeUFAno,
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    fetch("/mapas/brasil-estados.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeojson(data);
      });
  }, []);

  const getCor = (valor: number) => {
    if (valor < 3.0) return "rgb(247, 244, 249)"; // Nível 1: Muito Baixa (< 3.0)
    if (valor < 5.0) return "rgb(235, 160, 180)"; // Nível 2: Baixa (< 5.0)
    if (valor < 8.0) return "rgb(209, 76, 108)"; // Nível 3: Média (< 8.0)
    if (valor <10.0) return "rgb(140, 0, 42)";  // Nível 4: Alta (< 10.0)
    return "rgb(103, 0, 31)";                   // Nível 5: Muito Alta (> 10.0)
  };

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[-15, -55]}
        zoom={4}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{
          height: "100%",
          width: "100%",
          background: "#f8fafc",
        }}
      >
        {geojson && (
          <GeoJSON
            data={geojson}
            style={(feature: any) => {
              const uf = feature.properties.SIGLA;
              const estado = mortalidadeUFAno.find(
                (item) => item.uf === uf
              );
              const valor = estado?.tx_mortalidade_ccu || 0;

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.85,
                weight: 1,
                color: "#f8fafc",
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const uf = feature.properties.SIGLA;
              const estado = mortalidadeUFAno.find(
                (item) => item.uf === uf
              );

              if (!estado) return;

              let classificacao = "";
              const valor = estado.tx_mortalidade_ccu;

              if (valor < 3.0) {
                classificacao = "Muito Baixa";
              } else if (valor < 4.0) {
                classificacao = "Baixa";
              } else if (valor < 6.0) {
                classificacao = "Média";
              } else if (valor < 9.0) {
                classificacao = "Alta";
              } else {
                classificacao = "Muito Alta";
              }

              layer.bindPopup(`
                <div style="min-width:180px">
                  <strong>${estado.estado}</strong>
                  <br/>
                  UF: ${estado.uf}
                  <br/><br/>
                  Taxa Mortalidade CCU:
                  <strong>
                    ${Number(valor).toFixed(2)}
                  </strong>
                  <br/>
                  por 100.000 mulheres
                  <br/><br/>
                  🟣 <strong>${classificacao}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda e Reduzida */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1">
        <div className="font-semibold text-gray-700 mb-1">Mortalidade (por 100 mil)</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300" style={{ backgroundColor: "rgb(247, 244, 249)" }}></span>
          <span>Nível 1 (&lt; 3.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(235, 160, 180)" }}></span>
          <span>Nível 2 (3.0 - 5.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(209, 76, 108)" }}></span>
          <span>Nível 3 (5.0 - 8.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(140, 0, 42)" }}></span>
          <span>Nível 4 (8.0 - 10.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(103, 0, 31)" }}></span>
          <span>Nível 5 (&gt; 10.0)</span>
        </div>
      </div>
    </div>
  );
}