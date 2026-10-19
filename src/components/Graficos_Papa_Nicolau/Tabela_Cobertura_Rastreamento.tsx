"use client";

import React from "react";

export interface ItemTabelaRanking {
  codigo_ibge?: number | string;
  municipio: string;
  uf: string;
  cobertura: number | string;
}

interface TabelaCoberturaProps {
  anoReferencia?: string;
  dados?: ItemTabelaRanking[];
  loading?: boolean;
}

export default function Tabela_Cobertura_Rastreamento({
  anoReferencia = "2024",
  dados = [],
  loading = false,
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
            {loading ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-400">
                  Carregando ranking...
                </td>
              </tr>
            ) : dados.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-400">
                  Nenhum dado encontrado para o ano selecionado.
                </td>
              </tr>
            ) : (
              dados.map((item, index) => {
                const valorCobertura = Number(item.cobertura || 0);

                return (
                  <tr
                    key={item.codigo_ibge || index}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-2.5 px-4 text-center font-bold text-slate-600">
                      {index + 1}º
                    </td>
                    <td className="py-2.5 px-4">
                      {item.municipio} - {item.uf}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                      {/* Formata diretamente com 1 casa decimal */}
                      {`${valorCobertura.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}