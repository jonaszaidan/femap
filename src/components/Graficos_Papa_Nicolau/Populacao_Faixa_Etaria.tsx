"use client";

import React from "react";

export interface FaixaEtariaItem {
  faixa_etaria: string;
  total_pessoas: number;
}

interface AlvoFaixaEtariaProps {
  dados?: FaixaEtariaItem[];
  loading?: boolean;
}

export default function Alvo_Faixa_Etaria({
  dados = [],
  loading = false,
}: AlvoFaixaEtariaProps) {
  // Encontra o maior valor populacional para calcular as barras relativas (100% será o maior grupo)
  const maxPessoas = Math.max(...dados.map((d) => d.total_pessoas), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1">
      <h3 className="font-bold text-slate-800 text-base mb-4">
        População alvo por faixa etária
      </h3>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Carregando...
        </div>
      ) : dados.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Sem dados disponíveis
        </div>
      ) : (
        <div className="space-y-3 text-xs font-semibold text-slate-600">
          {dados.map((item) => {
            // Calcula a largura da barra proporcionalmente ao valor máximo
            const pct = Math.round((item.total_pessoas / maxPessoas) * 100);

            return (
              <div
                key={item.faixa_etaria}
                className="flex items-center gap-3 w-full"
              >
                {/* 1. Maior espaço para o texto da faixa etária */}
                <span className="w-24 min-w-[96px] text-left whitespace-nowrap text-slate-700">
                  {item.faixa_etaria}
                </span>

                {/* 2. Barra de progresso com comprimento ajustado */}
                <div className="flex-1 bg-purple-50 h-4 rounded-sm overflow-hidden relative">
                  <div
                    className="bg-purple-300 h-full rounded-sm transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* 3. Total de pessoas exibido ao final da barra */}
                <span className="w-20 text-right font-bold text-slate-800 whitespace-nowrap">
                  {item.total_pessoas.toLocaleString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}