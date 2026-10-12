
"use client";

import dynamic from "next/dynamic";

const MapaPrioridade_Municipios = dynamic(
  () => import("./MapaPrioridade_Municipios"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg font-medium">
        Carregando mapa de municípios...
      </div>
    ),
  }
);

export default function DynamicMapaPrioridade(props: any) {
  return <MapaPrioridade_Municipios {...props} />;
}