"use client";

import React from "react";

export interface FaixaEtariaVacinacaoItem {
  faixa_etaria: string;
  feminino?: number;
  masculino?: number;
  populacao_alvo: number;
}

interface Props {
  dados?: FaixaEtariaVacinacaoItem[];
  loading?: boolean;
  sexoFiltro?: string;
}

export default function Alvo_Faixa_Etaria_Vacinacao({
  dados = [],
  loading = false,
  sexoFiltro = "geral",
}: Props) {
  const maxVal = Math.max(...dados.map((d) => d.populacao_alvo), 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      
      {/* CABEÇALHO E LEGENDA CONDICIONAL */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-base font-bold text-slate-900">
          População alvo por faixa etária
        </h3>

        {/* Legenda restrita estritamente ao filtro de sexo selecionado */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          {(sexoFiltro === "geral" || sexoFiltro === "feminino") && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D8B4FE]" />
              <span className="text-slate-600">Feminino</span>
            </div>
          )}
          {(sexoFiltro === "geral" || sexoFiltro === "masculino") && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#818CF8]" />
              <span className="text-slate-600">Masculino</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-slate-400">
          Carregando dados por faixa etária...
        </div>
      ) : dados.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          Nenhum dado encontrado para o ano selecionado.
        </div>
      ) : (
        <div className="space-y-3">
          {dados.map((item) => {
            const fem = item.feminino || 0;
            const masc = item.masculino || 0;
            const total = item.populacao_alvo || fem + masc || 1;

            const pctLarguraTotal = Math.min((total / maxVal) * 100, 100);
            const pctFem = (fem / total) * 100;
            const pctMasc = (masc / total) * 100;

            return (
              <div key={item.faixa_etaria} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-right font-medium text-slate-600 text-xs shrink-0">
                  {item.faixa_etaria}
                </span>

                <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5 relative flex items-center">
                  <div
                    className="h-full rounded-full flex overflow-hidden transition-all duration-500"
                    style={{ width: `${pctLarguraTotal}%` }}
                  >
                    {/* Exibe o segmento feminino se for Geral ou Feminino */}
                    {(sexoFiltro === "geral" || sexoFiltro === "feminino") && (
                      <div
                        className="bg-[#D8B4FE] h-full transition-all duration-500"
                        style={{ width: sexoFiltro === "feminino" ? "100%" : `${pctFem}%` }}
                        title={`Feminino: ${fem.toLocaleString("pt-BR")}`}
                      />
                    )}
                    {/* Exibe o segmento masculino se for Geral ou Masculino */}
                    {(sexoFiltro === "geral" || sexoFiltro === "masculino") && (
                      <div
                        className="bg-[#818CF8] h-full transition-all duration-500"
                        style={{ width: sexoFiltro === "masculino" ? "100%" : `${pctMasc}%` }}
                        title={`Masculino: ${masc.toLocaleString("pt-BR")}`}
                      />
                    )}
                  </div>
                </div>

                <span className="w-24 text-right font-bold text-slate-800 text-xs shrink-0">
                  {total.toLocaleString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}