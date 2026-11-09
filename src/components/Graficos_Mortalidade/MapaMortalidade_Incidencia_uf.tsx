"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface IncidenciaUF {
  uf: string;
  estado?: string;
  ano?: number;
  incidencia?: number;
}

interface Props {
  incidenciaUFAno?: IncidenciaUF[];
}

// Faixas de incidência (nº de casos) — usadas no mapa e na legenda
const FAIXAS = [
  { max: 10, cor: "#FBE8F0", label: "Nível 1 (< 10)", classe: "Muito Baixa" },
  { max: 25, cor: "#F2B8D0", label: "Nível 2 (10 - 25)", classe: "Baixa" },
  { max: 50, cor: "#E47FAE", label: "Nível 3 (25 - 50)", classe: "Média" },
  { max: 100, cor: "#C34F83", label: "Nível 4 (50 - 100)", classe: "Alta" },
  { max: Infinity, cor: "#85264F", label: "Nível 5 (≥ 100)", classe: "Muito Alta" },
];

const COR_SEM_DADOS = "rgb(241, 245, 249)";

const getFaixa = (valor: number) =>
  FAIXAS.find((f) => valor < f.max) ?? FAIXAS[FAIXAS.length - 1];

const getCor = (valor: number) =>
  !valor || valor <= 0 ? COR_SEM_DADOS : getFaixa(valor).cor;

export default function MapaIncidenciaUF({ incidenciaUFAno = [] }: Props) {
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

  const listaDados = Array.isArray(incidenciaUFAno) ? incidenciaUFAno : [];

  // Muda quando o ano/dados mudam, forçando o GeoJSON a redesenhar
  const dataKey = listaDados.map((d) => `${d.uf}:${d.incidencia}`).join("|");

  const getSiglaFromFeature = (feature: any): string => {
    const props = feature.properties || {};
    const siglaRaw = props.SIGLA || props.sigla || props.uf || props.UF || props.id || "";
    return String(siglaRaw).trim().toUpperCase();
  };

  const encontrarEstado = (siglaGeo: string) =>
    listaDados.find(
      (item) => String(item.uf || "").trim().toUpperCase() === siglaGeo
    );

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
        style={{ height: "100%", width: "100%", background: "#f8fafc" }}
      >
        {geojson && (
          <GeoJSON
            key={dataKey}
            data={geojson}
            style={(feature: any) => {
              const estado = encontrarEstado(getSiglaFromFeature(feature));
              const valor = Number(estado?.incidencia ?? 0);

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
              const valor = Number(estado?.incidencia ?? 0);

              const nomeEstado =
                feature.properties?.NM_ESTADO ||
                feature.properties?.name ||
                estado?.estado ||
                siglaGeo;

              layer.bindPopup(`
                <div style="min-width:180px; font-family: sans-serif;">
                  <strong style="font-size:14px;">${nomeEstado}</strong>
                  <br/>
                  <span style="font-size:11px; color:#64748b;">UF: ${siglaGeo}</span>
                  <br/><br/>
                  Incidência:
                  <br/>
                  <<strong style="font-size:15px; color:#85264F;">
                    ${valor > 0 ? valor.toLocaleString("pt-BR") : "Sem dados"}
                  </strong>
                  ${valor > 0 ? " casos" : ""}
                  <br/><br/>
                  <strong>${valor > 0 ? getFaixa(valor).classe : "Sem classificação"}</strong>
                </div>
              `);
            }}
          />
        )}
      </MapContainer>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-md shadow-md text-xs space-y-1 border border-slate-100">
        <div className="font-semibold text-gray-700 mb-1">Incidência (nº de casos)</div>
        {FAIXAS.map((f) => (
          <div key={f.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
              style={{ backgroundColor: f.cor }}
            ></span>
            <span>{f.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
            style={{ backgroundColor: COR_SEM_DADOS }}
          ></span>
          <span>Sem dados</span>
        </div>
      </div>
    </div>
  );
}