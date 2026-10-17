"use client";

import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MortalidadeItem {
  municipio: string;
  codigo_ibge: string;
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

function normalizarTexto(texto: string = "") {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getColor(taxa: number) {
  if (taxa > 15) return "#C00000"; // Roxo muito escuro (Prioridade Máxima)
  if (taxa > 10) return "#ED7D31";
  if (taxa > 5)  return "#FFC000";
  if (taxa > 0)  return "#00B050";
  return "#aaadab";                // Sem dados / Taxa 0.00
}

export default function MapaPrioridade_Municipios({
  dadosMortalidade = [],
  anoSelecionado,
  busca,
}: MapaPrioridadeProps) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-100-mun.json"
    )
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
  }, []);

  // 1. Filtrar a lista de mortalidade pelo ano do filtro global
  const mortalidadeAno = dadosMortalidade.filter(
    (item) => String(item.ano) === String(anoSelecionado)
  );

  // 2. Mapear as taxas usando o Código IBGE e o Nome
  const mapaPorIbge = new Map<string, number>();
  const mapaPorNome = new Map<string, number>();

  mortalidadeAno.forEach((item) => {
    // Tenta pegar a taxa tanto se vier como 'tx.mortalidade' quanto 'tx_mortalidade'
    const valorTaxa = Number(item["tx.mortalidade"] ?? item.tx_mortalidade) || 0;

    if (item.codigo_ibge) {
      mapaPorIbge.set(String(item.codigo_ibge).trim(), valorTaxa);
    }
    if (item.municipio) {
      mapaPorNome.set(normalizarTexto(item.municipio), valorTaxa);
    }
  });

  // Função auxiliar para buscar a taxa exata de cada polígono
  const obterTaxa = (feature: any): number => {
    const props = feature.properties || {};
    
    // Tenta pegar o código IBGE por diversas propriedades comuns de GeoJSONs do Brasil
    const idIbge = String(
      props.id || props.GEOCODIGO || props.code || props.codarea || ""
    ).trim();
    
    const nomeMunicipio = props.name || props.description || props.NM_MUN || "";

    // 1. Busca exata por código IBGE
    if (idIbge && mapaPorIbge.has(idIbge)) {
      return mapaPorIbge.get(idIbge)!;
    }

    // 2. Fallback por nome sem acento
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
      weight: 0.2,
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
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-slate-200 relative bg-[#f8fafc]">
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        minZoom={4}
        maxZoom={9}
        maxBounds={BRASIL_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full bg-slate-50"
      >
        {/*
          IMPORTANTE: A prop 'key' força a recriação do componente GeoJSON 
          sempre que os dados carregarem, a busca mudar ou o ano for trocado.
        */}
        {geoData && (
          <GeoJSON
            key={`mapa-mortalidade-${anoSelecionado}-${mortalidadeAno.length}-${busca}`}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* LEGENDA FLUTUANTE */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-3.5 rounded-lg shadow-md border border-slate-200 z-[1000] text-xs">
        <p className="font-bold text-slate-800 mb-2">Taxa de Mortalidade</p>
        <div className="space-y-1.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#4a044e]" />
            <span>&gt; 15.0 (Prioridade Máxima)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#7e22ce]" />
            <span>10.0 - 15.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#a855f7]" />
            <span>5.0 - 10.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#c084fc]" />
            <span>0.1 - 5.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f3e8ff] border border-slate-300" />
            <span>0.00 / Sem dados</span>
          </div>
        </div>
      </div>
    </div>
  );
}