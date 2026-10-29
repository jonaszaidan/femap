"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MortalidadeItem {
  municipio: string;
  codigo_ibge: string;
  uf?: string;
  sigla_uf?: string;
  ano: number | string;
  "tx.mortalidade"?: number;
  tx_mortalidade?: number;
}

interface MapaPrioridadeProps {
  dadosMortalidade: MortalidadeItem[];
  anoSelecionado: string;
  busca: string;
}

const BRASIL_BOUNDS: L.LatLngBoundsExpression = [
  [-33.75, -73.98],
  [5.27, -28.85],
];

// Limites aproximados (Bounds) de cada estado para o zoom automático
const ESTADO_BOUNDS: Record<string, L.LatLngBoundsExpression> = {
  AC: [[-11.16, -74.00], [-7.11, -66.60]],
  AL: [[-10.50, -38.23], [-8.81, -35.16]],
  AP: [[-1.23, -54.67], [4.44, -49.91]],
  AM: [[-9.82, -73.80], [2.25, -56.10]],
  BA: [[-18.35, -46.61], [-8.53, -37.33]],
  CE: [[-7.54, -41.42], [-2.78, -37.25]],
  DF: [[-16.05, -48.28], [-15.50, -47.30]],
  ES: [[-21.30, -41.87], [-17.89, -39.67]],
  GO: [[-19.50, -53.25], [-12.39, -45.91]],
  MA: [[-10.43, -48.74], [-1.05, -41.73]],
  MT: [[-17.88, -61.23], [-7.34, -50.22]],
  MS: [[-24.37, -58.17], [-17.16, -50.93]],
  MG: [[-22.92, -51.04], [-14.23, -39.86]],
  PA: [[-9.88, -58.90], [2.59, -48.41]],
  PB: [[-8.30, -38.76], [-6.02, -34.79]],
  PR: [[-26.71, -54.62], [-22.51, -48.22]],
  PE: [[-9.48, -41.35], [-7.15, -34.80]],
  PI: [[-10.93, -45.99], [-2.73, -40.36]],
  RJ: [[-23.38, -44.88], [-20.76, -40.95]],
  RN: [[-6.98, -38.58], [-4.83, -34.96]],
  RS: [[-33.75, -57.64], [-27.08, -49.69]],
  RO: [[-13.58, -66.82], [-7.97, -59.77]],
  RR: [[-1.58, -64.83], [5.27, -58.89]],
  SC: [[-29.35, -53.83], [-25.95, -48.35]],
  SP: [[-25.31, -53.10], [-19.78, -44.16]],
  SE: [[-11.57, -38.25], [-9.51, -36.39]],
  TO: [[-13.43, -50.83], [-4.97, -45.69]],
};

// Lista de UFs para o select
const LISTA_UFS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

function normalizarTexto(texto: string = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getColor(taxa: number) {
  if (taxa > 15) return "#C00000"; // Prioridade Máxima
  if (taxa > 10) return "#ED7D31";
  if (taxa > 5)  return "#FFC000";
  if (taxa > 0)  return "#00B050";
  return "#aaadab";               // Sem dados / Taxa 0.00
}

// Componente auxiliar interno para controlar o Zoom/Bounds do Leaflet de forma reativa
function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 7 });
    }
  }, [bounds, map]);
  return null;
}

export default function MapaPrioridade_Municipios({
  dadosMortalidade = [],
  anoSelecionado,
  busca,
}: MapaPrioridadeProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [ufSelecionada, setUfSelecionada] = useState<string>("TODOS");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-100-mun.json"
    )
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
  }, []);

  const mortalidadeAno = useMemo(() => {
    return dadosMortalidade.filter(
      (item) => String(item.ano) === String(anoSelecionado)
    );
  }, [dadosMortalidade, anoSelecionado]);

  const { mapaPorIbge, mapaPorNome } = useMemo(() => {
    const porIbge = new Map<string, number>();
    const porNome = new Map<string, number>();

    mortalidadeAno.forEach((item) => {
      const valorTaxa = Number(item["tx.mortalidade"] ?? item.tx_mortalidade) || 0;
      if (item.codigo_ibge) {
        porIbge.set(String(item.codigo_ibge).trim(), valorTaxa);
      }
      if (item.municipio) {
        porNome.set(normalizarTexto(item.municipio), valorTaxa);
      }
    });

    return { mapaPorIbge: porIbge, mapaPorNome: porNome };
  }, [mortalidadeAno]);

  const geoDataFiltrado = useMemo(() => {
    if (!geoData) return null;
    if (ufSelecionada === "TODOS") return geoData;

    const municipiosFiltrados = geoData.features.filter((feature: any) => {
      const props = feature.properties || {};
      const idIbge = String(props.id || props.GEOCODIGO || props.code || "").trim();
      
      const prefixoUfMap: Record<string, string> = {
        "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
        "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL", "28": "SE", "29": "BA",
        "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
        "41": "PR", "42": "SC", "43": "RS",
        "50": "MS", "51": "MT", "52": "GO", "53": "DF"
      };

      const siglaEstado = prefixoUfMap[idIbge.substring(0, 2)];
      return siglaEstado === ufSelecionada;
    });

    return {
      type: "FeatureCollection",
      features: municipiosFiltrados,
    };
  }, [geoData, ufSelecionada]);

  // Define para onde o mapa deve apontar (Brasil inteiro ou o estado selecionado)
  const currentBounds = useMemo(() => {
    if (ufSelecionada === "TODOS" || !ESTADO_BOUNDS[ufSelecionada]) {
      return BRASIL_BOUNDS;
    }
    return ESTADO_BOUNDS[ufSelecionada];
  }, [ufSelecionada]);

  const obterTaxa = (feature: any): number => {
    const props = feature.properties || {};
    const idIbge = String(
      props.id || props.GEOCODIGO || props.code || props.codarea || ""
    ).trim();
    const nomeMunicipio = props.name || props.description || props.NM_MUN || "";

    if (idIbge && mapaPorIbge.has(idIbge)) {
      return mapaPorIbge.get(idIbge)!;
    }

    const nomeNorm = normalizarTexto(nomeMunicipio);
    if (mapaPorNome.has(nomeNorm)) {
      return mapaPorNome.get(nomeNorm)!;
    }

    return 0;
  };

  const styleFeature = (feature: any) => {
    const taxa = obterTaxa(feature);
    const nomeMunicipio =
      feature.properties?.name || feature.properties?.description || "";

    const atendeBusca =
      !busca || normalizarTexto(nomeMunicipio).includes(normalizarTexto(busca));

    return {
      fillColor: getColor(taxa),
      weight: 0.3,
      opacity: 0.9,
      color: "#ffffff",
      fillOpacity: atendeBusca ? 0.9 : 0.15,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const nomeMunicipio =
      feature.properties?.name || feature.properties?.description || "Município";
    const taxa = obterTaxa(feature);

    layer.bindTooltip(
      `<div style="font-size: 12px; font-weight: 600; color: #1e293b;">
        <strong style="color: #0f172a;">${nomeMunicipio}</strong><br/>
        <span style="color: #7e22ce;">Mortalidade: ${
          taxa > 0 ? taxa.toFixed(2) : "0.00 / Sem dados"
        }</span>
      </div>`,
      { sticky: true }
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* BARRA DE FILTRO POR UF */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700">Filtrar por Estado (UF):</span>
          <select
            value={ufSelecionada}
            onChange={(e) => setUfSelecionada(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all cursor-pointer"
          >
            <option value="TODOS">Todos os Estados (Brasil)</option>
            {LISTA_UFS.map((uf) => (
              <option key={uf.sigla} value={uf.sigla}>
                {uf.sigla} - {uf.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {ufSelecionada === "TODOS" 
            ? "Exibindo visão nacional completa" 
            : `Zoom aplicado para o estado: ${ufSelecionada}`}
        </div>
      </div>

      {/* CONTÊINER DO MAPA */}
      <div className="w-full h-[750px] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative bg-[#f8fafc]">
        <MapContainer
          center={[-14.235, -51.9253]}
          zoom={4}
          minZoom={4}
          maxZoom={10}
          scrollWheelZoom={true}
          className="w-full h-full bg-slate-50"
        >
          {/* Componente interno que controla o re-centramento e zoom automático */}
          <ChangeView bounds={currentBounds} />

          {geoDataFiltrado && (
            <GeoJSON
              key={`mapa-mortalidade-${ufSelecionada}-${anoSelecionado}-${busca}`}
              data={geoDataFiltrado}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        {/* LEGENDA FLUTUANTE */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-3.5 rounded-2xl shadow-sm border border-slate-100 z-[1000] text-xs">
          <p className="font-bold text-slate-800 mb-2">Taxa de Mortalidade</p>
          <div className="space-y-1.5 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#C00000]" />
              <span>&gt; 15.0 (Prioridade Máxima)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#ED7D31]" />
              <span>10.0 - 15.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#FFC000]" />
              <span>5.0 - 10.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#00B050]" />
              <span>0.1 - 5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#aaadab] border border-slate-300" />
              <span>0.00 / Sem dados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}