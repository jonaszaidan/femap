"use client";

import React, { useState, useEffect } from "react";
import Kpi_Pap_Smear from "./Graficos_Papa_Nicolau/Kpis_Papa_Nicolau";
import Alvo_Faixa_Etaria from "./Graficos_Papa_Nicolau/Alvo_Faixa_Etaria";
import DynamicMapaPapaNicolau from "./Graficos_Papa_Nicolau/DynamicMapaPapaNicolau";
import Evolucao_Vacinacao, {
  EvolucaoColetaItem,
} from "./Graficos_Papa_Nicolau/Evolucao_Coleta_PapaNicolau";
import Tabela_Cobertura_Rastreamento from "./Graficos_Papa_Nicolau/Tabela_Cobertura_Rastreamento";

import {
  getTotalExamesPapaNicolau,
  getTotalTaxaSisabPapaNicolau,
} from "../services/queries_papanicolau/papaNicolauKpiQueries";
import { getEvolucaoRastreamentoPapaNicolau } from "../services/queries_papanicolau/papaNicolauEvolucaoQueries";
import { getColetaPapaNicolauPorEstado } from "../services/queries_papanicolau/papaNicolauMapaQueries"; // 👈 IMPORTADO DA QUERY DO MAPA

export default function DashboardPapSmear() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const anosDisponiveis = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  // Estados dos KPIs
  const [totalExamesKpi, setTotalExamesKpi] = useState<string>("5.000");
  const [taxaSisabKpi, setTaxaSisabKpi] = useState<string>("35%");
  const [loadingKpi, setLoadingKpi] = useState<boolean>(false);

  // Estado para os dados do Mapa por UF
  const [dadosMapaUF, setDadosMapaUF] = useState<any[]>([]);

  // Estado para o gráfico de evolução
  const [dadosEvolucao, setDadosEvolucao] = useState<EvolucaoColetaItem[]>([]);

  // 1. Carrega os KPIs e o Mapa quando o Ano selecionado mudar
  useEffect(() => {
    async function carregarDadosAno() {
      setLoadingKpi(true);

      const [dadosExames, dadosSisab, dadosMapa] = await Promise.all([
        getTotalExamesPapaNicolau(anoSelecionado, "Total"),
        getTotalTaxaSisabPapaNicolau(anoSelecionado, "Total_UF"),
        getColetaPapaNicolauPorEstado(anoSelecionado), // 👈 BUSCA OS DADOS DOS ESTADOS PARA O MAPA
      ]);

      // Guarda os dados do Mapa
      setDadosMapaUF(dadosMapa || []);

      // Trata KPI de Total de Exames
      if (
        dadosExames &&
        dadosExames.total_exames !== undefined &&
        dadosExames.total_exames !== null
      ) {
        setTotalExamesKpi(
          Number(dadosExames.total_exames).toLocaleString("pt-BR")
        );
      } else {
        setTotalExamesKpi("0");
      }

      // Trata KPI de Taxa SISAB
      const valorSisab = dadosSisab?.media_tx_coleta_uf;
      if (valorSisab !== undefined && valorSisab !== null) {
        const valorNumerico = Number(valorSisab);
        const formatado =
          valorNumerico <= 1
            ? `${(valorNumerico * 100).toFixed(1)}%`
            : `${valorNumerico.toFixed(1)}%`;
        setTaxaSisabKpi(formatado);
      } else {
        setTaxaSisabKpi("0%");
      }

      setLoadingKpi(false);
    }

    carregarDadosAno();
  }, [anoSelecionado]);

  // 2. Carrega a evolução temporal (uma única vez)
  useEffect(() => {
    async function carregarEvolucao() {
      const dados = await getEvolucaoRastreamentoPapaNicolau("Total_UF");
      setDadosEvolucao(dados);
    }

    carregarEvolucao();
  }, []);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO DASHBOARD COM O SELECT DE ANO */}
      <div className="bg-[#8B9BB4] text-white rounded-xl px-6 py-3 flex justify-between items-center font-bold text-lg shadow-sm">
        <h2>Prevenção Secundária: Exame de Papanicolaou</h2>

        <div className="flex items-center gap-4 text-sm font-normal">
          <span>
            Referência: <strong>Brasil</strong>
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="select-ano">Ano:</label>
            <select
              id="select-ano"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(Number(e.target.value))}
              className="bg-white text-gray-800 border border-gray-300 px-3 py-1 rounded-md text-sm font-bold shadow-sm focus:outline-none cursor-pointer"
            >
              {anosDisponiveis.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GRID SUPERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Kpi_Pap_Smear
            taxaSisab={loadingKpi ? "..." : taxaSisabKpi}
            totalExames={loadingKpi ? "..." : totalExamesKpi}
          />
          <Alvo_Faixa_Etaria />
        </div>

        {/* MAPA DINÂMICO PASSANDO OS DADOS BUSCADOS DA QUERY */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <DynamicMapaPapaNicolau coletaUFAno={dadosMapaUF} />
        </div>
      </div>

      {/* EVOLUÇÃO DA COBERTURA */}
      <div className="w-full">
        <Evolucao_Vacinacao dados={dadosEvolucao} referencia="Brasil" />
      </div>

      {/* TABELA DE MUNICÍPIOS */}
      <div className="w-full">
        <Tabela_Cobertura_Rastreamento
          anoReferencia={String(anoSelecionado)}
        />
      </div>
    </div>
  );
}