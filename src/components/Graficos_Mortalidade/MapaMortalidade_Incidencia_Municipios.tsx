"use client";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";

export interface IncidenciaMunicipioItem {
  codigo_ibge: string | number;
  cidade?: string;
  ano?: number;
  incidencia?: number;
}

interface Props {
  incidenciaMunicipiosAno?: IncidenciaMunicipioItem[];
  codigoUfIbge?: string; // Ex: '31' para MG, '16' para AP
}

// Faixas de incidência (nº de casos) — usadas no mapa, no popup e na legenda
const FAIXAS = [
  { max: 2, cor: "#FBE8F0", label: "Nível 1 (1 caso)", classe: "Muito Baixa" },
  { max: 4, cor: "#F2B8D0", label: "Nível 2 (2 - 3)", classe: "Baixa" },
  { max: 10, cor: "#E47FAE", label: "Nível 3 (4 - 9)", classe: "Média" },
  { max: 25, cor: "#C34F83", label: "Nível 4 (10 - 24)", classe: "Alta" },
  { max: Infinity, cor: "#85264F", label: "Nível 5 (≥ 25)", classe: "Muito Alta" },
];

const COR_SEM_DADOS = "rgb(241, 245, 249)";

const getFaixa = (valor: number) =>
  FAIXAS.find((f) => valor < f.max) ?? FAIXAS[FAIXAS.length - 1];

const getCor = (valor: number) =>
  !valor || valor <= 0 ? COR_SEM_DADOS : getFaixa(valor).cor;

// Usa só os 6 primeiros dígitos do código, para casar com ou sem dígito verificador
const chaveCodigo = (codigo: string | number | undefined | null) =>
  String(codigo ?? "").trim().slice(0, 6);

// Componente para centralizar e ajustar o zoom automaticamente no estado selecionado
function AjustarFocoMapa({ geojson }: { geojson: any }) {
  const map = useMap();

  useEffect(() => {
    if (geojson && geojson.features && geojson.features.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(geojson);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20], maxZoom: 10 });
        }
      } catch (e) {
        console.error("Erro ao ajustar foco do mapa:", e);
      }
    }
  }, [geojson, map]);

  return null;
}

export default function MapaIncidenciaMunicipios({
  incidenciaMunicipiosAno = [],
  codigoUfIbge = "31",
}: Props) {
  const [geojson, setGeojson] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    if (!codigoUfIbge) return;

    let ativo = true;
    setLoading(true);
    setErro("");
    setGeojson(null);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const caminhoArquivo = `${basePath}/mapas/municipios/geojs-${codigoUfIbge}-mun.json`;

    fetch(caminhoArquivo)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Não foi possível carregar: ${caminhoArquivo}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!ativo) return;
        if (data && data.features && Array.isArray(data.features)) {
          setGeojson(data);
        } else {
          throw new Error("Formato GeoJSON inválido.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar GeoJSON local:", err);
        if (ativo) {
          setGeojson(null);
          setErro(err.message || "Erro ao carregar o mapa.");
          setLoading(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [codigoUfIbge]);

  // Índice código (6 dígitos) -> item, para busca direta em vez de varrer a lista a cada município
  const dadosPorCodigo = useMemo(() => {
    const mapa = new Map<string, IncidenciaMunicipioItem>();
    if (Array.isArray(incidenciaMunicipiosAno)) {
      incidenciaMunicipiosAno.forEach((item) => {
        mapa.set(chaveCodigo(item.codigo_ibge), item);
      });
    }
    return mapa;
  }, [incidenciaMunicipiosAno]);

  // Muda quando o ano/dados mudam, forçando o GeoJSON a redesenhar
  const dataKey = useMemo(
    () =>
      Array.isArray(incidenciaMunicipiosAno)
        ? incidenciaMunicipiosAno.map((d) => `${d.codigo_ibge}:${d.incidencia}`).join("|")
        : "",
    [incidenciaMunicipiosAno]
  );

  const getCodigoFeature = (feature: any): string =>
    String(
      feature.properties?.id ||
        feature.id ||
        feature.properties?.description ||
        feature.properties?.CD_MUN ||
        ""
    ).trim();

  return (
    <div className="relative h-[480px] rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-slate-500">
          Carregando municípios...
        </div>
      )}

      {erro && (
        <div className="absolute inset-0 z-[1000] bg-white flex items-center justify-center text-xs font-semibold text-red-600 p-4 text-center">
          {erro}
        </div>
      )}

      {/* A prop key={codigoUfIbge} força o MapContainer a re-inicializar o mapa limpo sempre que troca o estado */}
      <MapContainer
        key={codigoUfIbge}
        center={[-15.78, -47.92]}
        zoom={6}
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
          <>
            <AjustarFocoMapa geojson={geojson} />
            <GeoJSON
              key={`geo-${codigoUfIbge}-${dataKey}`}
              data={geojson}
              style={(feature: any) => {
                const item = dadosPorCodigo.get(chaveCodigo(getCodigoFeature(feature)));
                const valor = Number(item?.incidencia ?? 0);

                return {
                  fillColor: getCor(valor),
                  fillOpacity: 0.85,
                  weight: 0.8,
                  color: "#ffffff",
                };
              }}
              onEachFeature={(feature: any, layer: any) => {
                const codIbgeFeature = getCodigoFeature(feature);
                const item = dadosPorCodigo.get(chaveCodigo(codIbgeFeature));
                const valor = Number(item?.incidencia ?? 0);

                const nomeMunicipio =
                  feature.properties?.name ||
                  feature.properties?.nome ||
                  feature.properties?.NM_MUN ||
                  item?.cidade ||
                  "Município";

                layer.bindPopup(`
                  <div style="min-width:160px; font-family: sans-serif;">
                    <strong style="font-size:14px;">${nomeMunicipio}</strong>
                    <br/>
                    <span style="font-size:11px; color:#64748b;">Código IBGE: ${codIbgeFeature || "-"}</span>
                    <br/><br/>
                    Incidência:
                    <br/>
                    <strong style="font-size:15px; color:#85264F;">
                      ${valor > 0 ? valor.toLocaleString("pt-BR") : "Sem casos"}
                    </strong>
                    ${valor > 0 ? (valor === 1 ? " caso" : " casos") : ""}
                    <br/><br/>
                    <strong>${valor > 0 ? getFaixa(valor).classe : "Sem classificação"}</strong>
                  </div>
                `);
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Legenda do Mapa */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md text-[11px] space-y-1 border border-slate-100">
        <div className="font-semibold text-slate-700 mb-1">Incidência (nº de casos)</div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
            style={{ backgroundColor: COR_SEM_DADOS }}
          ></span>
          <span>Sem casos</span>
        </div>
        {FAIXAS.map((f) => (
          <div key={f.label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300"
              style={{ backgroundColor: f.cor }}
            ></span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}