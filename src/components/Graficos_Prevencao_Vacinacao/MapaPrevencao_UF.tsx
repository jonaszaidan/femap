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
}

export default function MapaPrevencao_UF({ vacinacaoUFAno = [] }: Props) {
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

  // Define escala de cores para Taxa de Vacinação HPV (%)
  const getCor = (valor: number) => {
    if (valor <= 0) return "#E5E7EB";
    if (valor < 50.0) return "#FEE2E2"; // Baixa cobertura (Vermelho suave)
    if (valor < 70.0) return "#FEF08A"; // Média cobertura (Amarelo)
    if (valor < 85.0) return "#BBF7D0"; // Boa cobertura (Verde claro)
    return "#15803D";                  // Excelente cobertura (Verde escuro)
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
            data={geojson}
            style={(feature: any) => {
              const siglaGeo = extrairUF(feature.properties);
              const estadoEncontrado = listaDados.find(
                (item) => item.uf?.trim().toUpperCase() === siglaGeo
              );
              const valor = estadoEncontrado?.tx_vacinacao_uf || 0;

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.85,
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