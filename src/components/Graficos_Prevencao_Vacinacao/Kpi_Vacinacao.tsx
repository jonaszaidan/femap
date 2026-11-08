"use client";

import React from "react";

interface KpiVacinacaoProps {
  taxaCobertura?: string;
  dosesAplicadas?: string;
  populacaoAlvo?: string;
  subtituloCobertura?: string;
  filtro?: string; // "geral" | "feminino" | "masculino"
}

// Tema de cada filtro: fundo do card, cor do texto principal e do subtítulo
const TEMAS: Record<string, { bg: string; texto: string; subtexto: string }> = {
  geral: { bg: "#B397CB", texto: "#0f172a", subtexto: "#475569" },
  feminino: { bg: "#E47FAE", texto: "#ffffff", subtexto: "rgba(255,255,255,0.8)" },
  masculino: { bg: "#789ACB", texto: "#0f172a", subtexto: "#475569" }, // defina a cor depois
};

export default function Kpi_Vacinacao({
  taxaCobertura = "75%",
  dosesAplicadas = "5.590",
  populacaoAlvo = "8.000",
  subtituloCobertura = "Da população de 9 a 14 anos",
  filtro = "geral",
}: KpiVacinacaoProps) {
  const tema = TEMAS[String(filtro ?? "").trim().toLowerCase()] ?? TEMAS.geral;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* CARD 1: TAXA DE COBERTURA */}
      <div
        className="p-5 rounded-2xl text-center flex flex-col justify-between items-center shadow-sm min-h-[140px] transition-colors duration-300"
        style={{ backgroundColor: tema.bg, color: tema.texto }}
      >
        <span className="text-base font-bold leading-tight">
          Taxa de <br /> cobertura
        </span>

        <div className="my-1">
          <span className="text-3xl font-black block">{taxaCobertura}</span>
          {subtituloCobertura && (
            <span
              className="text-[10px] font-semibold block mt-0.5"
              style={{ color: tema.subtexto }}
            >
              {subtituloCobertura}
            </span>
          )}
        </div>
      </div>

      {/* CARD 2: DOSES APLICADAS */}
      <div
        className="p-5 rounded-2xl text-center flex flex-col justify-between items-center shadow-sm min-h-[140px] transition-colors duration-300"
        style={{ backgroundColor: tema.bg, color: tema.texto }}
      >
        <span className="text-base font-bold leading-tight">
          Doses <br /> aplicadas
        </span>

        <span className="text-3xl font-black mb-2">{dosesAplicadas}</span>
      </div>

      {/* CARD 3: POPULAÇÃO ALVO TOTAL (LARGURA TOTAL) */}
      <div
        className="col-span-2 p-5 rounded-2xl text-center flex flex-col justify-center items-center shadow-sm min-h-[110px] transition-colors duration-300"
        style={{ backgroundColor: tema.bg, color: tema.texto }}
      >
        <span className="text-base font-bold mb-1">População alvo total</span>

        <span className="text-3xl font-black">{populacaoAlvo}</span>
      </div>
    </div>
  );
}