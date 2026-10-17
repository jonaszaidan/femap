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

export interface EvolucaoItem {
  ano: string | number;
  ab_mortalidade_ccu?: number;
  mortalidade?: number;
  incidencia?: number;
  lesao?: number;
  hsil?: number;
}

interface EvolucaoAbsolutaChartProps {
  data?: EvolucaoItem[];
  referencia?: string;
}

export default function EvolucaoMortalidade_CCU({
  data = [],
  referencia = "Brasil",
}: EvolucaoAbsolutaChartProps) {
  const dadosFormatados = data.map((item) => ({
    ano: item.ano,
    mortalidade: item.ab_mortalidade_ccu ?? item.mortalidade ?? 0,
    incidencia: item.incidencia ?? 0,
    hsil: item.lesao ?? item.hsil ?? 0,
  }));

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Cabeçalho do Card */}
      <div className="bg-slate-400 text-white px-6 py-3 flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-wide">
          Evolução dos números absolutos ao longo do tempo
        </h3>
        <span className="text-sm font-medium opacity-90">
          Referência: <strong>{referencia}</strong>
        </span>
      </div>

      {/* Área do Gráfico */}
      <div className="p-6 pt-8 w-full h-[360px]">
        {dadosFormatados.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
            Carregando dados de evolução...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dadosFormatados}
              margin={{ top: 25, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

              <XAxis
                dataKey="ano"
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                dy={10}
              />

              <YAxis hide domain={["auto", "auto"]} />

              <Tooltip
                formatter={(val: any) => [
                  val ? Number(val).toLocaleString("pt-BR") : "0",
                  "",
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: "20px" }}
                iconType="plainline"
              />

              {/* Linha 1: HSIL (Verde) */}
              <Line
                type="monotone"
                dataKey="hsil"
                name="HSIL"
                stroke="#15803d"
                strokeWidth={3}
                dot={{ r: 4, fill: "#15803d" }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="hsil"
                  position="top"
                  offset={10}
                  formatter={(val: any) =>
                    val ? Number(val).toLocaleString("pt-BR") : ""
                  }
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
                dot={{ r: 4, fill: "#ea580c" }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="incidencia"
                  position="top"
                  offset={10}
                  formatter={(val: any) =>
                    val ? Number(val).toLocaleString("pt-BR") : ""
                  }
                  style={{ fill: "#334155", fontSize: "12px", fontWeight: "600" }}
                />
              </Line>

              {/* Linha 3: Mortalidade (Roxo) */}
              <Line
                type="monotone"
                dataKey="mortalidade"
                name="Mortalidade"
                stroke="#7e22ce"
                strokeWidth={3}
                dot={{ r: 4, fill: "#7e22ce" }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="mortalidade"
                  position="top"
                  offset={10}
                  formatter={(val: any) =>
                    val ? Number(val).toLocaleString("pt-BR") : ""
                  }
                  style={{ fill: "#334155", fontSize: "12px", fontWeight: "600" }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}