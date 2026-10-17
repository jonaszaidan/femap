"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Interface alinhada com o retorno da query coleta_papa_nicolau_uf
export interface ColetaPapaNicolauUF {
  uf: string;
  estado?: string;
  ano?: number;
  media_tx_coleta_uf?: number;
}

interface Props {
  coletaUFAno?: ColetaPapaNicolauUF[];
}

export default function MapaColetaPapaNicolauUF({
  coletaUFAno = [],
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    fetch("/mapas/brasil-estados.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeojson(data);
      });
  }, []);

  // Faixas ajustadas para a Taxa de Coleta de Papanicolau
  const getCor = (valor: number) => {
    if (valor <= 0) return "rgb(241, 245, 249)";  // Sem dados / Zero
    if (valor < 15.0) return "rgb(192, 0, 0)"; // Nível 1: Muito Baixa (< 15.0%)
    if (valor < 18.0) return "rgb(237, 125, 49)"; // Nível 2: Baixa (15.0% - 18.0%)
    if (valor < 21.0) return "rgb(255, 192, 0)"; // Nível 3: Média (18.0% - 21.0%)
    if (valor < 25.0) return "rgb(0, 176, 80)";   // Nível 4: Alta (21.0% - 25.0%)
    return "rgb(0, 125, 50)";                     // Nível 5: Muito Alta (> 25.0%)
  };

  // Garante que listaDados é sempre um Array válido
  const listaDados = Array.isArray(coletaUFAno) ? coletaUFAno : [];

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
              const valor = estado?.media_tx_coleta_uf || 0;

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

              const valor = estado.media_tx_coleta_uf || 0;
              let classificacao = "";

              if (valor < 15.0) {
                classificacao = "Muito Baixa";
              } else if (valor < 18.0) {
                classificacao = "Baixa";
              } else if (valor < 21.0) {
                classificacao = "Média";
              } else if (valor < 25.0) {
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
                  Taxa Média de Coleta:
                  <strong>
                    ${Number(valor).toFixed(2)}%
                  </strong>
                  <br/><br/>
                  📊 <strong>${classificacao}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1">
        <div className="font-semibold text-gray-700 mb-1">Taxa de Coleta (%)</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(192, 0, 0)" }}></span>
          <span>Muito Baixa (&lt; 15,0%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(237, 125, 49)" }}></span>
          <span>Baixa (15,0% - 18,0%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(255, 192, 0)" }}></span>
          <span>Média (18,0% - 21,0%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(0, 176, 80)" }}></span>
          <span>Alta (21,0% - 25,0%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "rgb(0, 125, 50)" }}></span>
          <span>Muito Alta (&gt; 25,0%)</span>
        </div>
      </div>
    </div>
  );
}