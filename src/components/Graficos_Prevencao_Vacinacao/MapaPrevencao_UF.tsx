"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export interface VacinacaoUFItem {
  uf: string;
  estado?: string;
  ano?: number;
  tx_vacinacao_uf?: number;
}

interface Props {
  vacinacaoUFAno?: VacinacaoUFItem[];
  loading?: boolean;
  filtro?: string; // "geral" | "feminino" | "masculino"
}

// Paleta de 5 níveis por filtro (do mais claro ao mais escuro)
const PALETAS: Record<string, string[]> = {
  feminino: ["#FBE8F0", "#F2B8D0", "#E47FAE", "#C34F83", "#85264F"],
  geral: ["#F1EBF6", "#D7C4E5", "#B397CB", "#76528F", "#49305F"],
  masculino: ["#EAF0F8", "#CEDBED", "#A5BDDF", "#789ACB", "#5278B0"],
};

const COR_SEM_DADOS = "#E5E7EB";

export default function MapaPrevencao_UF({
  vacinacaoUFAno = [],
  filtro = "geral",
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    // Obtém o prefixo de caminho base do Next.js (ex: '/femap' no GitHub Pages)
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const geojsonUrl = `${basePath}/mapas/brasil-estados.geojson`;

    fetch(geojsonUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP ao buscar GeoJSON: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setGeojson(data))
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
  }, []);

  const chaveFiltro = String(filtro ?? "").trim().toLowerCase();
  const paleta = PALETAS[chaveFiltro] ?? PALETAS.geral;

  // Escala de cores para Taxa de Vacinação HPV (%) — 5 níveis
  const getCor = (valor: number) => {
    if (valor <= 0) return COR_SEM_DADOS;
    if (valor < 50.0) return paleta[0]; // Nível 1 (< 50%)
    if (valor < 65.0) return paleta[1]; // Nível 2 (50 - 65%)
    if (valor < 75.0) return paleta[2]; // Nível 3 (65 - 75%)
    if (valor < 85.0) return paleta[3]; // Nível 4 (75 - 85%)
    return paleta[4];                   // Nível 5 (>= 85%)
  };

  const listaDados = Array.isArray(vacinacaoUFAno) ? vacinacaoUFAno : [];

  // Extrai a sigla da UF independente das variações de propriedades do GeoJSON
  const extrairUF = (properties: any) => {
    if (!properties) return "";
    return (
      properties.SIGLA ||
      properties.sigla ||
      properties.UF ||
      properties.uf ||
      properties.UF_05 ||
      ""
    ).toString().trim().toUpperCase();
  };

  // Extrai o nome do Estado
  const extrairNomeEstado = (properties: any) => {
    if (!properties) return "";
    return (
      properties.NOME ||
      properties.nome ||
      properties.NM_ESTADO ||
      properties.NAME ||
      ""
    ).toString().trim();
  };

  // Força o GeoJSON a redesenhar quando o filtro ou os dados mudam
  const chaveGeo = `${chaveFiltro}-${listaDados
    .map((d) => d.tx_vacinacao_uf ?? 0)
    .join(",")}`;

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={[-15, -55]}
        zoom={4}
        zoomControl={false}
        attributionControl={false}
        dragging={true}
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
            key={chaveGeo}
            data={geojson}
            style={(feature: any) => {
              const siglaGeo = extrairUF(feature.properties);
              const estadoEncontrado = listaDados.find(
                (item) => item.uf?.trim().toUpperCase() === siglaGeo
              );
              const valor = estadoEncontrado?.tx_vacinacao_uf || 0;

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.9,
                weight: 1,
                color: "#FFFFFF",
              };
            }}
            onEachFeature={(feature: any, layer: any) => {
              const siglaGeo = extrairUF(feature.properties);
              const estadoEncontrado = listaDados.find(
                (item) => item.uf?.trim().toUpperCase() === siglaGeo
              );
              const valor = estadoEncontrado?.tx_vacinacao_uf || 0;
              const nomeGeo = extrairNomeEstado(feature.properties);
              const nomeExibicao = estadoEncontrado?.estado || nomeGeo || siglaGeo;

              layer.bindPopup(`
                <div style="min-width:160px; font-family: sans-serif;">
                  <strong style="font-size: 14px;">${nomeExibicao} (${siglaGeo})</strong>
                  <br/><br/>
                  Taxa de Vacinação: <strong>${Number(valor).toFixed(1)}%</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}