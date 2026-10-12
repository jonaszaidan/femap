"use client";

import React, { useState } from "react";
import Kpi_Pap_Smear from "./Graficos_Papa_Nicolau/Kpi_Pap_Smear";
import Alvo_Faixa_Etaria from "./Graficos_Papa_Nicolau/Alvo_Faixa_Etaria";
import DynamicMapaPrevencao from "./Graficos_Papa_Nicolau/DynamicMapaPrevencao";
import Evolucao_Vacinacao from "./Graficos_Papa_Nicolau/Evolucao_Vacinacao";
import Tabela_Cobertura_Rastreamento from "./Graficos_Papa_Nicolau/Tabela_Cobertura_Rastreamento";

export default function DashboardPapSmear() {
  const [anoSelecionado, setAnoSelecionado] = useState("2024");

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO DASHBOARD */}
      <div className="bg-slate-400 text-white rounded-xl px-6 py-3 flex justify-between items-center font-bold text-lg shadow-sm">
        <h2>Prevenção Secundária: Exame de Papanicolaou</h2>
        <div className="flex items-center gap-4 text-sm font-normal">
          <span>Referência: <strong>Brasil</strong></span>
          <span>Ano: <strong>{anoSelecionado}</strong></span>
        </div>
      </div>

      {/* GRID SUPERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Kpi_Pap_Smear />
          <Alvo_Faixa_Etaria />
        </div>

        <div className="lg:col-span-7 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <DynamicMapaPrevencao />
        </div>
      </div>

      {/* EVOLUÇÃO */}
      <div className="w-full">
        <Evolucao_Vacinacao />
      </div>

      {/* TABELA DE RASTREAMENTO DE MUNICÍPIOS */}
      <div className="w-full">
        <Tabela_Cobertura_Rastreamento anoReferencia={anoSelecionado} />
      </div>
    </div>
  );
}