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
  filtro?: string; // "geral" | "feminino" | "masculino"
}

// Tema por filtro: cor de destaque (linha/pontos) + banner do cabeçalho
const TEMAS: Record<
  string,
  { destaque: string; bannerBg: string; bannerTexto: string; grade: string }
> = {
  feminino: {
    destaque: "#D92F78",
    bannerBg: "#F2B8D0",
    bannerTexto: "#85264F",
    grade: "#FBE8F0",
  },
  geral: {
    destaque: "#8B5AAE",
    bannerBg: "#D7C4E5",
    bannerTexto: "#49305F",
    grade: "#F1EBF6",
  },
  masculino: {
    destaque: "#2878C7",
    bannerBg: "#CEDBED",
    bannerTexto: "#5278B0",
    grade: "#EAF0F8",
  },
};

export default function Evolucao_Vacinacao({
  dados = [],
  referencia = "Brasil",
  loading = false,
  filtro = "geral",
}: Props) {
  const tema = TEMAS[String(filtro ?? "").trim().toLowerCase()] ?? TEMAS.geral;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* BANNER / CABEÇALHO */}
      <div
        className="px-6 py-3 flex justify-between items-center font-bold transition-colors duration-300"
        style={{ backgroundColor: tema.bannerBg, color: tema.bannerTexto }}
      >
        <h3 className="text-base">
          Evolução da cobertura de vacinação ao longo do tempo
        </h3>
        <span className="text-xs font-medium">
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tema.grade} />
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
                stroke={tema.destaque}
                strokeWidth={3}
                dot={{ r: 5, fill: tema.destaque }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}