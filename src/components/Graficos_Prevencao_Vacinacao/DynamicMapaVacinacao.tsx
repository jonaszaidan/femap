"use client";

import dynamic from "next/dynamic";
import { VacinacaoUFItem } from "./MapaPrevencao_UF";

interface DynamicMapaProps {
  vacinacaoUFAno?: VacinacaoUFItem[];
  loading?: boolean;
}

const MapaPrevencao_UF = dynamic(
  () => import("./MapaPrevencao_UF"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg font-medium">
        Carregando mapa de vacinação...
      </div>
    )
  }
);

export default function DynamicMapaVacinacao({ vacinacaoUFAno, loading }: DynamicMapaProps) {
  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg font-medium">
        Carregando dados do mapa...
      </div>
    );
  }

  return <MapaPrevencao_UF vacinacaoUFAno={vacinacaoUFAno} loading={loading} />;
}