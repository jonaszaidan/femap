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
  taxa?: number;
}

interface Props {
  coletaUFAno?: ColetaPapaNicolauUF[];
}

export default function MapaColetaPapaNicolauUF({
  coletaUFAno = [],
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${basePath}/mapas/brasil-estados.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar GeoJSON de Estados para Papanicolau");
        return res.json();
      })
      .then((data) => {
        setGeojson(data);
      })
      .catch((err) => {
        console.error("Erro no mapa Papanicolau UF:", err);
      });
  }, []);

  // Faixas ajustadas para a Taxa de Coleta de Papanicolau
  const getCor = (valor: number) => {
    if (!valor || valor <= 0) return "rgb(241, 245, 249)";  // Sem dados / Zero
    if (valor < 15.0) return "rgb(192, 0, 0)"; // Nível 1: Muito Baixa (< 15.0%)
    if (valor < 18.0) return "rgb(237, 125, 49)"; // Nível 2: Baixa (15.0% - 18.0%)
    if (valor < 21.0) return "rgb(255, 192, 0)"; // Nível 3: Média (18.0% - 21.0%)
    if (valor < 25.0) return "rgb(0, 176, 80)";   // Nível 4: Alta (21.0% - 25.0%)
    return "rgb(0, 125, 50)";                    // Nível 5: Muito Alta (> 25.0%)
  };

  // Garante que listaDados é sempre um Array válido
  const listaDados = Array.isArray(coletaUFAno) ? coletaUFAno : [];

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
                estado?.media_tx_coleta_uf ?? estado?.taxa ?? 0
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
                estado?.media_tx_coleta_uf ?? estado?.taxa ?? 0
              );

              let classificacao = "Muito Baixa";
              if (valor >= 25.0) classificacao = "Muito Alta";
              else if (valor >= 21.0) classificacao = "Alta";
              else if (valor >= 18.0) classificacao = "Média";
              else if (valor >= 15.0) classificacao = "Baixa";

              const nomeEstado = feature.properties?.NM_ESTADO || feature.properties?.name || estado?.estado || estado?.uf || siglaGeo;

              layer.bindPopup(`
                <div style="min-width:180px; font-family: sans-serif;">
                  <strong style="font-size:14px;">${nomeEstado}</strong>
                  <br/>
                  <span style="font-size:11px; color:#64748b;">UF: ${siglaGeo}</span>
                  <br/><br/>
                  Taxa Média de Coleta:
                  <br/>
                  <strong style="font-size:15px; color:#007d32;">
                    ${valor > 0 ? valor.toFixed(2) + "%" : "Sem dados"}
                  </strong>
                  <br/><br/>
                  📊 <strong>${valor > 0 ? classificacao : "Sem classificação"}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda Posicionada à Esquerda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1 border border-slate-100">
        <div className="font-semibold text-gray-700 mb-1">Taxa de Coleta (%)</div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300" style={{ backgroundColor: "rgb(241, 245, 249)" }}></span>
          <span>Sem dados / Zero</span>
        </div>
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