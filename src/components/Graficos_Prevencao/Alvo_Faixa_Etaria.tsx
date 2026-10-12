"use client";

import React from "react";

interface FaixaEtariaItem {
  faixa: string;
  pct: number;
}

interface AlvoFaixaEtariaProps {
  dados?: FaixaEtariaItem[];
}

const dadosPadrao: FaixaEtariaItem[] = [
  { faixa: "60 - 64", pct: 75 },
  { faixa: "55 - 59", pct: 85 },
  { faixa: "50 - 54", pct: 70 },
  { faixa: "45 - 49", pct: 80 },
  { faixa: "40 - 44", pct: 65 },
  { faixa: "35 - 39", pct: 60 },
  { faixa: "30 - 34", pct: 75 },
  { faixa: "25 - 29", pct: 70 },
];

export default function Alvo_Faixa_Etaria({
  dados = dadosPadrao,
}: AlvoFaixaEtariaProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1">
      <h3 className="font-bold text-slate-800 text-base mb-4">
        População alvo por faixa etária
      </h3>

      <div className="space-y-2.5 text-xs font-semibold text-slate-600">
        {dados.map((item) => (
          <div key={item.faixa} className="flex items-center gap-3">
            <span className="w-12 text-right">{item.faixa}</span>
            <div className="flex-1 bg-purple-50 h-4 rounded-sm overflow-hidden">
              <div
                className="bg-purple-300 h-full rounded-sm transition-all duration-500"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}