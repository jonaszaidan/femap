"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface EvolucaoVacinacaoItem {
  ano: string;
  taxa: number;
}

interface Props {
  dados?: EvolucaoVacinacaoItem[];
  referencia?: string;
  loading?: boolean;
}

export default function Evolucao_Vacinacao({
  dados = [],
  referencia = "Brasil",
  loading = false,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div className="bg-slate-300 text-white px-6 py-3 flex justify-between items-center font-bold">
        <h3 className="text-base text-slate-800">
          Evolução da cobertura de vacinação ao longo do tempo
        </h3>
        <span className="text-xs text-slate-700 font-medium">
          Referência: <strong>{referencia}</strong>
        </span>
      </div>

      {/* ÁREA DO GRÁFICO */}
      <div className="p-6 h-[300px] w-full flex items-center justify-center">
        {loading ? (
          <div className="text-slate-400 text-sm">Carregando evolução...</div>
        ) : dados.length === 0 ? (
          <div className="text-slate-400 text-sm">
            Nenhum dado de evolução temporal encontrado.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="ano" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                unit="%"
                domain={[0, 100]}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, "Taxa de Cobertura"]}
                labelFormatter={(label) => `Ano: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="taxa"
                name="Cobertura de vacinação de 9 a 14 anos"
                stroke="#7E22CE"
                strokeWidth={3}
                dot={{ r: 5, fill: "#7E22CE" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}