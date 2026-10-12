"use client";

import dynamic from "next/dynamic";

const MapaPrevencao_UF = dynamic(
  () => import("./MapaPrevencao_UF"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg font-medium">
        Carregando mapa...
      </div>
    )
  }
);

export default function DynamicMapaPrevencao() {
  return <MapaPrevencao_UF />;
}