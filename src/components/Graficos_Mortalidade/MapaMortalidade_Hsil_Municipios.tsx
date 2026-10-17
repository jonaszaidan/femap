"use client";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

export interface HsilMunicipioItem {
  municipio?: string;
  ano?: number;
  tx_hsil_municipio?: number | string;
  codigo_ibge: string | number;
}

interface Props {
  hsilMunicipiosAno?: HsilMunicipioItem[];
  codigoUfIbge?: string; // Ex: '31' para MG, '52' para GO
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

export default function MapaMortalidade_Hsil_Municipios({
  hsilMunicipiosAno = [],
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

    // Ajustado para o mesmo caminho de arquivos do mapa de mortalidade
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
        console.error("Erro ao carregar GeoJSON local de HSIL:", err);
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

  // Faixas de cores da Taxa de HSIL
  const getCor = (valor: number) => {
    if (valor <= 0) return "rgb(241, 245, 249)"; // Sem dados ou Zero (Cinza claro)
    if (valor < 0.2) return "rgb(209, 250, 229)"; // Nível 1 (< 0.2)
    if (valor < 0.5) return "rgb(110, 231, 183)"; // Nível 2 (0.2 - 0.5)
    if (valor < 1.0) return "rgb(52, 211, 153)";  // Nível 3 (0.5 - 1.0)
    if (valor < 2.0) return "rgb(16, 185, 129)";  // Nível 4 (1.0 - 2.0)
    return "rgb(4, 120, 87)";                     // Nível 5 (> 2.0)
  };

  const listaDados = Array.isArray(hsilMunicipiosAno)
    ? hsilMunicipiosAno
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
              key={`geo-hsil-${codigoUfIbge}`}
              data={geojson}
              style={(feature: any) => {
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

                const valor = itemMunicipio?.tx_hsil_municipio !== undefined && itemMunicipio?.tx_hsil_municipio !== null
                  ? Number(itemMunicipio.tx_hsil_municipio)
                  : 0;

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

                const valor = itemMunicipio?.tx_hsil_municipio !== undefined && itemMunicipio?.tx_hsil_municipio !== null
                  ? Number(itemMunicipio.tx_hsil_municipio)
                  : 0;

                layer.bindPopup(`
                  <div style="min-width:160px; font-family: sans-serif;">
                    <strong style="font-size:14px;">${nomeMunicipio}</strong>
                    <br/>
                    <span style="font-size:11px; color:#64748b;">Código IBGE: ${codIbgeFeature || "-"}</span>
                    <br/><br/>
                    Taxa de HSIL:
                    <br/>
                    <strong style="font-size:15px; color:#047857;">
                      ${Number(valor).toFixed(2)}
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
          Taxa HSIL
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(209,250,229)]"></span>
          <span>Nível 1 (&lt; 0.2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(110,231,183)]"></span>
          <span>Nível 2 (0.2 - 0.5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(52,211,153)]"></span>
          <span>Nível 3 (0.5 - 1.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(16,185,129)]"></span>
          <span>Nível 4 (1.0 - 2.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[rgb(4,120,87)]"></span>
          <span>Nível 5 (&gt; 2.0)</span>
        </div>
      </div>
    </div>
  );
}