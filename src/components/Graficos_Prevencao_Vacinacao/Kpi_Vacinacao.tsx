"use client";

import React from "react";

interface KpiVacinacaoProps {
  taxaCobertura?: string;
  dosesAplicadas?: string;
  populacaoAlvo?: string;
  subtituloCobertura?: string;
}

export default function Kpi_Vacinacao({
  taxaCobertura = "75%",
  dosesAplicadas = "5.590",
  populacaoAlvo = "8.000",
  subtituloCobertura = "Da população de 9 a 14 anos",
}: KpiVacinacaoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* CARD 1: TAXA DE COBERTURA */}
      <div className="bg-[#f2f2f2] p-5 rounded-2xl text-center flex flex-col justify-between items-center shadow-sm min-h-[140px]">
        <span className="text-base font-bold text-slate-900 leading-tight">
          Taxa de <br /> cobertura
        </span>

        <div className="my-1">
          <span className="text-3xl font-black text-slate-900 block">
            {taxaCobertura}
          </span>
          {subtituloCobertura && (
            <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">
              {subtituloCobertura}
            </span>
          )}
        </div>
      </div>

      {/* CARD 2: DOSES APLICADAS */}
      <div className="bg-[#f2f2f2] p-5 rounded-2xl text-center flex flex-col justify-between items-center shadow-sm min-h-[140px]">
        <span className="text-base font-bold text-slate-900 leading-tight">
          Doses <br /> aplicadas
        </span>

        <span className="text-3xl font-black text-slate-900 mb-2">
          {dosesAplicadas}
        </span>
      </div>

      {/* CARD 3: POPULAÇÃO ALVO TOTAL (LARGURA TOTAL) */}
      <div className="col-span-2 bg-[#f2f2f2] p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-sm min-h-[110px]">
        <span className="text-base font-bold text-slate-900 mb-1">
          População alvo total
        </span>

        <span className="text-3xl font-black text-slate-900">
          {populacaoAlvo}
        </span>
      </div>
    </div>
  );
}