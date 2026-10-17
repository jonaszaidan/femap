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
  taxa?: number;
}

interface Props {
  hsilUFAno?: HsilUF[];
}

export default function MapaMortalidadeHsilUF({
  hsilUFAno = [],
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/mapas/brasil-estados.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar GeoJSON de Estados para HSIL");
        return res.json();
      })
      .then((data) => {
        setGeojson(data);
      })
      .catch((err) => {
        console.error("Erro no mapa HSIL UF:", err);
      });
  }, []);

  const getCor = (valor: number) => {
    if (!valor || valor <= 0) return "rgb(241, 245, 249)"; // Sem dados / Zero
    if (valor < 0.2) return "rgb(237, 248, 233)"; // Muito Baixa
    if (valor < 0.4) return "rgb(186, 228, 179)"; // Baixa
    if (valor < 0.6) return "rgb(116, 196, 118)"; // Média
    if (valor < 0.9) return "rgb(49, 163, 84)";   // Alta
    return "rgb(0, 109, 44)";                     // Muito Alta
  };

  // Garante que listaDados é sempre um Array válido
  const listaDados = Array.isArray(hsilUFAno) ? hsilUFAno : [];

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
                estado?.tx_hsil_uf ?? estado?.taxa ?? 0
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
                estado?.tx_hsil_uf ?? estado?.taxa ?? 0
              );

              let classificacao = "Muito Baixa";
              if (valor >= 0.9) classificacao = "Muito Alta";
              else if (valor >= 0.6) classificacao = "Alta";
              else if (valor >= 0.4) classificacao = "Média";
              else if (valor >= 0.2) classificacao = "Baixa";

              const nomeEstado = feature.properties?.NM_ESTADO || feature.properties?.name || estado?.estado || estado?.uf || siglaGeo;

              layer.bindPopup(`
                <div style="min-width:180px; font-family: sans-serif;">
                  <strong style="font-size:14px;">${nomeEstado}</strong>
                  <br/>
                  <span style="font-size:11px; color:#64748b;">UF: ${siglaGeo}</span>
                  <br/><br/>
                  Taxa HSIL:
                  <br/>
                  <strong style="font-size:15px; color:#047857;">
                    ${valor > 0 ? valor.toFixed(2) : "Sem dados"}
                  </strong>
                  <br/><br/>
                  🟢 <strong>${valor > 0 ? classificacao : "Sem classificação"}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1 border border-slate-100">
        <div className="font-semibold text-gray-700 mb-1">Taxa HSIL</div>
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