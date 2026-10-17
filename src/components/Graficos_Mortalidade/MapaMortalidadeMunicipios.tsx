"use client";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

export interface MortalidadeMunicipioItem {
  municipio: string;
  ano?: number;
  tx_mortalidade?: number;
  codigo_ibge: string | number;
}

interface Props {
  mortalidadeMunicipiosAno?: MortalidadeMunicipioItem[];
  codigoUfIbge?: string; // Ex: '31' para MG, '16' para AP
}

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

export default function MapaMortalidadeMunicipios({
  mortalidadeMunicipiosAno = [],
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

    const caminhoArquivo = `/mapas/municipios/geojs-${codigoUfIbge}-mun.json`;

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

  // Faixas de cores da Taxa de Mortalidade (por 100 mil)
  const getCor = (valor: number) => {
    if (valor <= 0) return "rgb(241, 245, 249)"; // Sem dados ou Zero (Cinza claro)
    if (valor < 3.0) return "rgb(254, 226, 226)"; // Nível 1 (< 3.0)
    if (valor < 5.0) return "rgb(252, 165, 165)"; // Nível 2 (3.0 - 5.0)
    if (valor < 8.0) return "rgb(248, 113, 113)"; // Nível 3 (5.0 - 8.0)
    if (valor < 10.0) return "rgb(220, 38, 38)";  // Nível 4 (8.0 - 10.0)
    return "rgb(153, 27, 27)";                    // Nível 5 (> 10.0)
  };

  const listaDados = Array.isArray(mortalidadeMunicipiosAno)
    ? mortalidadeMunicipiosAno
    : [];

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
              key={`geo-${codigoUfIbge}`}
              data={geojson}
              style={(feature: any) => {
                // No geodata-br, o código do município de 6 ou 7 dígitos fica em 'id' ou 'properties.id'
                const codIbgeFeature = String(
                  feature.properties?.id ||
                  feature.id ||
                  feature.properties?.description ||
                  feature.properties?.CD_MUN ||
                  ""
                ).trim();

                const itemMunicipio = listaDados.find((item) => {
                  const codBanco = String(item.codigo_ibge || "").trim();
                  return codBanco.startsWith(codIbgeFeature) || codIbgeFeature.startsWith(codBanco);
                });

                const valor = itemMunicipio?.tx_mortalidade || 0;

                return {
                  fillColor: getCor(valor),
                  fillOpacity: 0.85,
                  weight: 0.8,
                  color: "#ffffff",
                };
              }}
              onEachFeature={(feature: any, layer: any) => {
                const codIbgeFeature = String(
                  feature.properties?.id ||
                  feature.id ||
                  feature.properties?.description ||
                  feature.properties?.CD_MUN ||
                  ""
                ).trim();

                const nomeMunicipio =
                  feature.properties?.name ||
                  feature.properties?.nome ||
                  feature.properties?.NM_MUN ||
                  "Município";

                const itemMunicipio = listaDados.find((item) => {
                  const codBanco = String(item.codigo_ibge || "").trim();
                  return codBanco.startsWith(codIbgeFeature) || codIbgeFeature.startsWith(codBanco);
                });

                const valor = itemMunicipio?.tx_mortalidade || 0;

                layer.bindPopup(`
                  <div style="min-width:160px; font-family: sans-serif;">
                    <strong style="font-size:14px;">${nomeMunicipio}</strong>
                    <br/>
                    <span style="font-size:11px; color:#64748b;">Código IBGE: ${codIbgeFeature || "-"}</span>
                    <br/><br/>
                    Taxa de Mortalidade:
                    <br/>
                    <strong style="font-size:15px; color:#991b1b;">
                      ${Number(valor).toFixed(2)} / 100 mil
                    </strong>
                  </div>
                `);
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Legenda do Mapa */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md text-[11px] space-y-1 border border-slate-100">
        <div className="font-semibold text-slate-700 mb-1">
          Mortalidade (por 100 mil)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(254,226,226)]"></span>
          <span>Nível 1 (&lt; 3.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(252,165,165)]"></span>
          <span>Nível 2 (3.0 - 5.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(248,113,113)]"></span>
          <span>Nível 3 (5.0 - 8.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(220,38,38)]"></span>
          <span>Nível 4 (8.0 - 10.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(153,27,27)]"></span>
          <span>Nível 5 (&gt; 10.0)</span>
        </div>
      </div>
    </div>
  );
}