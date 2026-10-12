"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";

// Interface dos dados recebidos
export interface EvolucaoItem {
  ano: string | number;
  mortalidade: number;
  incidencia: number;
  hsil: number;
}



interface EvolucaoAbsolutaChartProps {
  data?: EvolucaoItem[];
}

// Dados mockados de exemplo (caso nenhuma prop seja passada de início)
const defaultData: EvolucaoItem[] = [
  { ano: "2021", mortalidade: 4.3, incidencia: 2.4, hsil: 2.0 },
  { ano: "2022", mortalidade: 2.5, incidencia: 4.4, hsil: 2.0 },
  { ano: "2023", mortalidade: 3.5, incidencia: 1.8, hsil: 3.0 },
  { ano: "2024", mortalidade: 4.5, incidencia: 2.8, hsil: 5.0 },
];

export default function EvolucaoMortalidade_CCU({
  data = defaultData,
}: EvolucaoAbsolutaChartProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Cabeçalho do Card */}
      <div className="bg-slate-400 text-white px-6 py-3 flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-wide">
          Evolução dos números absolutos ao longo do tempo
        </h3>
        <span className="text-sm font-medium opacity-90">
          Referência: Brasil
        </span>
      </div>

      {/* Área do Gráfico */}
      <div className="p-6 pt-8 w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            {/* Grid apenas horizontal leve na parte inferior */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

            <XAxis
              dataKey="ano"
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
              dy={10}
            />

            {/* Ocultando o eixo Y numérico para ficar idêntico ao protótipo */}
            <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            {/* Legenda superior centralizada */}
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingBottom: "20px" }}
              iconType="plainline"
            />

            {/* Linha 1: Mortalidade (Roxo) */}
            <Line
              type="monotone"
              dataKey="mortalidade"
              name="Mortalidade"
              stroke="#7e22ce"
              strokeWidth={3}
              dot={{ r: 3, fill: "#7e22ce" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="mortalidade"
                position="top"
                offset={10}
                style={{ fill: "#334155", fontSize: "12px", fontWeight: "600" }}
              />
            </Line>

            {/* Linha 2: Incidência (Laranja) */}
            <Line
              type="monotone"
              dataKey="incidencia"
              name="Incidência"
              stroke="#ea580c"
              strokeWidth={3}
              dot={{ r: 3, fill: "#ea580c" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="incidencia"
                position="top"
                offset={10}
                style={{ fill: "#334155", fontSize: "12px", fontWeight: "600" }}
              />
            </Line>

            {/* Linha 3: HSIL (Verde) */}
            <Line
              type="monotone"
              dataKey="hsil"
              name="HSIL"
              stroke="#15803d"
              strokeWidth={3}
              dot={{ r: 3, fill: "#15803d" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="hsil"
                position="top"
                offset={10}
                style={{ fill: "#334155", fontSize: "12px", fontWeight: "600" }}
              />
            </Line>

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}