"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MortalidadeUF {
  uf: string;
  estado?: string;
  ano?: number;
  tx_mortalidade_ccu?: number;
  tx_mortalidade?: number;
  taxa?: number;
}

interface Props {
  mortalidadeUFAno?: MortalidadeUF[];
}

export default function MapaMortalidadeUF({
  mortalidadeUFAno = [],
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/mapas/brasil-estados.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar GeoJSON de Estados");
        return res.json();
      })
      .then((data) => setGeojson(data))
      .catch((err) => console.error("Erro no mapa UF:", err));
  }, []);

  const getCor = (valor: number) => {
    if (!valor || valor <= 0) return "rgb(241, 245, 249)"; // Sem dados / Zero (Cinza claro)
    if (valor < 3.0) return "rgb(247, 244, 249)"; // Nível 1 (< 3.0)
    if (valor < 5.0) return "rgb(235, 160, 180)"; // Nível 2 (3.0 - 5.0)
    if (valor < 8.0) return "rgb(209, 76, 108)";  // Nível 3 (5.0 - 8.0)
    if (valor < 10.0) return "rgb(140, 0, 42)";  // Nível 4 (8.0 - 10.0)
    return "rgb(103, 0, 31)";                    // Nível 5 (> 10.0)
  };

  const listaDados = Array.isArray(mortalidadeUFAno) ? mortalidadeUFAno : [];

  // Extrai a sigla da UF independente de como ela vem nomeada no GeoJSON
  const getSiglaFromFeature = (feature: any): string => {
    const props = feature.properties || {};
    const siglaRaw = props.SIGLA || props.sigla || props.uf || props.UF || props.id || "";
    return String(siglaRaw).trim().toUpperCase();
  };

  // Encontra a UF na lista de dados recebida via Props
  const encontrarEstado = (siglaGeo: string) => {
    return listaDados.find((item) => {
      const ufBanco = String(item.uf || item.estado || "").trim().toUpperCase();
      return ufBanco === siglaGeo;
    });
  };

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden border border-slate-100 shadow-sm">
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
            key={JSON.stringify(listaDados.length)}
            data={geojson}
            style={(feature: any) => {
              const siglaGeo = getSiglaFromFeature(feature);
              const estado = encontrarEstado(siglaGeo);
              
              const valor = Number(
                estado?.tx_mortalidade_ccu ?? estado?.tx_mortalidade ?? estado?.taxa ?? 0
              );

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.85,
                weight: 1,
                color: "#ffffff",
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const siglaGeo = getSiglaFromFeature(feature);
              const estado = encontrarEstado(siglaGeo);

              const valor = Number(
                estado?.tx_mortalidade_ccu ?? estado?.tx_mortalidade ?? estado?.taxa ?? 0
              );

              let classificacao = "Muito Baixa";
              if (valor >= 10.0) classificacao = "Muito Alta";
              else if (valor >= 8.0) classificacao = "Alta";
              else if (valor >= 5.0) classificacao = "Média";
              else if (valor >= 3.0) classificacao = "Baixa";

              const nomeEstado = feature.properties?.NM_ESTADO || feature.properties?.name || estado?.estado || estado?.uf || siglaGeo;

              layer.bindPopup(`
                <div style="min-width:180px; font-family: sans-serif;">
                  <strong style="font-size:14px;">${nomeEstado}</strong>
                  <br/>
                  <span style="font-size:11px; color:#64748b;">UF: ${siglaGeo}</span>
                  <br/><br/>
                  Taxa Mortalidade CCU:
                  <br/>
                  <strong style="font-size:15px; color:#991b1b;">
                    ${valor > 0 ? valor.toFixed(2) : "Sem dados"}
                  </strong>
                  ${valor > 0 ? " / 100 mil" : ""}
                  <br/><br/>
                  🟣 <strong>${valor > 0 ? classificacao : "Sem classificação"}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1 border border-slate-100">
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