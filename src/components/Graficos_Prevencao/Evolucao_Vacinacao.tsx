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

interface EvolucaoItem {
  ano: string;
  cobertura: number;
}

interface EvolucaoVacinacaoProps {
  dados?: EvolucaoItem[];
}

const dadosPadrao: EvolucaoItem[] = [
  { ano: "2021", cobertura: 55 },
  { ano: "2022", cobertura: 60 },
  { ano: "2023", cobertura: 68 },
  { ano: "2024", cobertura: 85 },
];

export default function Evolucao_Vacinacao({
  dados = dadosPadrao,
}: EvolucaoVacinacaoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div className="bg-slate-300 text-white px-6 py-2.5 flex justify-between items-center">
        <h3 className="font-bold text-base text-slate-800">
          Evolução da cobertura de vacinação ao longo do tempo
        </h3>
        <span className="text-xs font-medium text-slate-700">
          Referência: <strong>Brasil</strong>
        </span>
      </div>

      {/* CONTEÚDO DO GRÁFICO */}
      <div className="p-6">
        {/* LEGENDA */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold text-slate-700">
          <span className="w-4 h-0.5 bg-purple-900 rounded-full inline-block" />
          <span>Cobertura de vacinação de 9 a 14 anos</span>
        </div>

        {/* ÁREA DO GRÁFICO DE LINHA */}
        <div className="w-full h-52">
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
                formatter={(value: number) => [`${value}%`, "Cobertura"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  borderColor: "#e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="cobertura"
                stroke="#581c87" // Roxo escuro do seu layout
                strokeWidth={3}
                dot={false}
              >
                <LabelList
                  dataKey="cobertura"
                  position="top"
                  offset={10}
                  style={{
                    fill: "#334155",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}