"use client";

import React from "react";

interface MunicipioCobertura {
  uf: string;
  codigo_ibge: string;
  municipio: string;
  sexo: string;
  ano: number;
  doses?: number;
  populacao?: number;
  tx_cobertura: number;
}

interface TabelaCoberturaProps {
  anoReferencia?: string;
  dados?: MunicipioCobertura[];
  loading?: boolean;
}

export default function Tabela_Cobertura_Vacinacao({
  anoReferencia = "2024",
  dados = [],
  loading = false,
}: TabelaCoberturaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div className="bg-slate-300 text-white px-6 py-2.5 flex justify-between items-center font-bold">
        <h3 className="text-base text-slate-800">
          Ranking de municípios com piores coberturas vacinais (9 a 14 anos)
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
              <th className="py-3 px-4 text-right w-32">Cobertura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-6 px-4 text-center text-slate-500">
                  Carregando...
                </td>
              </tr>
            ) : dados.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 px-4 text-center text-slate-500">
                  Sem dados para o período selecionado.
                </td>
              </tr>
            ) : (
              dados.map((item, index) => (
                <tr
                  key={`${item.codigo_ibge}-${item.sexo}`}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2.5 px-4 text-center font-bold text-slate-600">
                    {index + 1}º
                  </td>
                  <td className="py-2.5 px-4">
                    {item.municipio} - <span className="font-bold text-slate-900">{item.uf}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                    {item.tx_cobertura.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}