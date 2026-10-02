"use client";

import {
  MapContainer,
  GeoJSON,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface MortalidadeUF {
  uf: string;
  estado: string;
  ano: number;
  tx_mortalidade_ccu: number;
}

interface Props {
  mortalidadeUFAno: MortalidadeUF[];
}

export default function MapaMortalidadeUF({

  mortalidadeUFAno,
}: Props) {

  
  const [geojson, setGeojson] = useState<any>(null);

useEffect(() => {
  fetch("/mapas/brasil-estados.geojson")
    .then((res) => res.json())
    .then((data) => {
      setGeojson(data);
    });
}, []);

  const getCor = (valor: number) => {
    if (valor < 5) return "#22c55e";
    if (valor < 8) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden border">

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
            data={geojson}
            style={(feature: any) => {

              const uf =
                feature.properties.SIGLA;

              const estado =
                mortalidadeUFAno.find(
                  (item) => item.uf === uf
                );

              const valor =
                estado?.tx_mortalidade_ccu || 0;

              return {
                fillColor: getCor(valor),
                fillOpacity: 0.8,
                weight: 1,
                color: "#ffffff",
              };
            }}
            onEachFeature={(
              feature: any,
              layer: any
            ) => {

              const uf =
                feature.properties.SIGLA;

              const estado =
                mortalidadeUFAno.find(
                  (item) => item.uf === uf
                );

              if (!estado) return;

              let classificacao = "";
              let emoji = "";

              if (estado.tx_mortalidade_ccu < 5) {
                classificacao = "Baixa";
                emoji = "🟢";
              } else if (
                estado.tx_mortalidade_ccu < 8
              ) {
                classificacao = "Média";
                emoji = "🟡";
              } else {
                classificacao = "Alta";
                emoji = "🔴";
              }

              layer.bindPopup(`
                <div style="min-width:180px">

                  <strong>${estado.estado}</strong>

                  <br/>

                  UF: ${estado.uf}

                  <br/><br/>

                  Taxa Mortalidade CCU:

                  <strong>
                    ${Number(
                      estado.tx_mortalidade_ccu
                    ).toFixed(2)}
                </strong>

<br/>

por 100.000 mulheres

<br/><br/>

${emoji}
${classificacao}

</div>
`);
            }}
          />
        )}

      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded shadow text-sm">

        <div>
          🟢 Baixa (&lt; 5)
        </div>

        <div>
          🟡 Média (5 a 8)
        </div>

        <div>
          🔴 Alta (&gt; 8)
        </div>

      </div>

    </div>
  );
}