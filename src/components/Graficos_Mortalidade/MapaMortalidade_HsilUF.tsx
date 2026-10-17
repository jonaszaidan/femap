"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Interface ajustada para aceitar dados vindos do Dashboard (propriedades opcionais)
interface HsilUF {
  uf: string;
  estado?: string;
  ano?: number;
  tx_hsil_uf?: number;
}

interface Props {
  hsilUFAno?: HsilUF[];
}

export default function MapaMortalidadeHsilUF({
  hsilUFAno = [],
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
    if (valor < 0.2) return "rgb(237, 248, 233)"; // Muito Baixa
    if (valor < 0.4) return "rgb(186, 228, 179)"; // Baixa
    if (valor < 0.6) return "rgb(116, 196, 118)"; // Média
    if (valor < 0.9) return "rgb(49, 163, 84)";   // Alta
    return "rgb(0, 109, 44)";                     // Muito Alta
  };

  // Garante que listaDados é sempre um Array válido
  const listaDados = Array.isArray(hsilUFAno) ? hsilUFAno : [];

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
              const estado = listaDados.find((item) => item.uf === uf);
              const valor = estado?.tx_hsil_uf || 0;

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.85,
                weight: 1,
                color: "#f8fafc",
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const uf = feature.properties.SIGLA;
              const estado = listaDados.find((item) => item.uf === uf);

              if (!estado) return;

              let classificacao = "";
              const valor = estado.tx_hsil_uf || 0;

              if (valor < 0.2) {
                classificacao = "Muito Baixa";
              } else if (valor < 0.4) {
                classificacao = "Baixa";
              } else if (valor < 0.6) {
                classificacao = "Média";
              } else if (valor < 0.9) {
                classificacao = "Alta";
              } else {
                classificacao = "Muito Alta";
              }

              layer.bindPopup(`
                <div style="min-width:180px">
                  <strong>${estado.estado || estado.uf}</strong>
                  <br/>
                  UF: ${estado.uf}
                  <br/><br/>
                  Taxa HSIL:
                  <strong>
                    ${Number(valor).toFixed(2)}
                  </strong>
                  <br/>
                  por 100.000 mulheres
                  <br/><br/>
                  🟢 <strong>${classificacao}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1">
        <div className="font-semibold text-gray-700 mb-1">Taxa HSIL (por 100 mil)</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300" style={{ backgroundColor: "rgb(237, 248, 233)" }}></span>
          <span>Nível 1 (&lt; 0.2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(186, 228, 179)" }}></span>
          <span>Nível 2 (0.2 - 0.4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(116, 196, 118)" }}></span>
          <span>Nível 3 (0.4 - 0.6)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(49, 163, 84)" }}></span>
          <span>Nível 4 (0.6 - 0.9)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(0, 109, 44)" }}></span>
          <span>Nível 5 (&gt; 0.9)</span>
        </div>
      </div>
    </div>
  );
}