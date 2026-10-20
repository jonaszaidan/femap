"use client";

import React from "react";

interface MunicipioRanking {
  ranking: number;
  municipioUf: string;
  total: string | number;
}

interface TabelaCoberturaProps {
  anoReferencia?: string;
  dados?: MunicipioRanking[];
}

const dadosMock: MunicipioRanking[] = [
  { ranking: 1, municipioUf: "Município A - MA", total: "12%" },
  { ranking: 2, municipioUf: "Município B - PI", total: "14%" },
  { ranking: 3, municipioUf: "Município C - CE", total: "15%" },
  { ranking: 4, municipioUf: "Município D - BA", total: "18%" },
  { ranking: 5, municipioUf: "Município E - PA", total: "19%" },
  { ranking: 6, municipioUf: "Município F - PB", total: "20%" },
  { ranking: 7, municipioUf: "Município G - RN", total: "21%" },
];

export default function Tabela_Cobertura_Rastreamento({
  anoReferencia = "2024",
  dados = dadosMock,
}: TabelaCoberturaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div className="bg-slate-300 text-white px-6 py-2.5 flex justify-between items-center font-bold">
        <h3 className="text-base text-slate-800">
          Ranking de municípios com piores coberturas de rastreamento
        </h3>
        <span className="text-xs text-slate-700 font-medium">
          Ano de referência: <strong>{anoReferencia}</strong>
        </span>
      </div>

      {/* TABELA DE DADOS */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-800 text-slate-800 font-bold text-sm">
              <th className="py-3 px-4 text-center w-24">Ranking</th>
              <th className="py-3 px-4">Município - UF</th>
              <th className="py-3 px-4 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-medium">
            {dados.map((item) => (
              <tr key={item.ranking} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-4 text-center font-bold text-slate-600">
                  {item.ranking}º
                </td>
                <td className="py-2.5 px-4">{item.municipioUf}</td>
                <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}