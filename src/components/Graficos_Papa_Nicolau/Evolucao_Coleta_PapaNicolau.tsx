"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export interface EvolucaoColetaItem {
  ano: string | number;
  media_tx_coleta_uf: number;
}

interface EvolucaoColetaProps {
  dados?: EvolucaoColetaItem[];
  referencia?: string;
}

export default function Evolucao_Coleta_PapaNicolau({
  dados = [],
  referencia = "Brasil",
}: EvolucaoColetaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div className="bg-slate-300 text-white px-6 py-2.5 flex justify-between items-center">
        <h3 className="font-bold text-base text-slate-800">
          Evolução da cobertura de rastreamento ao longo do tempo
        </h3>
        <span className="text-xs font-medium text-slate-700">
          Referência: <strong>{referencia}</strong>
        </span>
      </div>

      {/* CONTEÚDO DO GRÁFICO */}
      <div className="p-6">
        {/* LEGENDA */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold text-slate-700">
          <span className="w-4 h-0.5 bg-purple-900 rounded-full inline-block" />
          <span>Média da taxa de coleta (%)</span>
        </div>

        {/* ÁREA DO GRÁFICO DE LINHA */}
        <div className="w-full h-52">
          {dados.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
              Carregando dados de evolução...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dados}
                margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
              >
                <XAxis
                  dataKey="ano"
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Taxa de Coleta"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#e2e8f0",
                    fontSize: "12px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="media_tx_coleta_uf"
                  stroke="#581c87" // Roxo escuro
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#581c87" }}
                >
                  <LabelList
                    dataKey="media_tx_coleta_uf"
                    position="top"
                    offset={10}
                    formatter={(val: any) => (val !== undefined && val !== null ? `${val}%` : "")}
                    style={{
                      fill: "#334155",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}