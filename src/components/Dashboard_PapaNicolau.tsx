"use client";

import React, { useState, useEffect } from "react";
import Kpi_Pap_Smear from "./Graficos_Papa_Nicolau/Kpis_Papa_Nicolau";
import Alvo_Faixa_Etaria, { FaixaEtariaItem } from "./Graficos_Papa_Nicolau/Populacao_Faixa_Etaria";
import DynamicMapaPapaNicolau from "./Graficos_Papa_Nicolau/DynamicMapaPapaNicolau";
import Evolucao_Vacinacao, {
  EvolucaoColetaItem,
} from "./Graficos_Papa_Nicolau/Evolucao_Coleta_PapaNicolau";
import Tabela_Cobertura_Rastreamento from "./Graficos_Papa_Nicolau/Tabela_Cobertura_Rastreamento";

import {
  getTotalExamesPapaNicolau,
  getTotalTaxaSisabPapaNicolau,
  getPopulacaoAlvoTotal,
} from "../services/queries_papanicolau/papaNicolauKpiQueries";
import { getEvolucaoRastreamentoPapaNicolau } from "../services/queries_papanicolau/papaNicolauEvolucaoQueries";
import { getColetaPapaNicolauPorEstado } from "../services/queries_papanicolau/papaNicolauMapaQueries";
import { getPopulacaoAlvoPorFaixaEtaria } from "../services/queries_papanicolau/papaNicolauPopulacaoFaixaQueries";
import { getTop10MenoresCoberturasMunicipios } from "../services/queries_papanicolau/papaNicolauTabelaQueries";

export default function DashboardPapSmear() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const anosDisponiveis = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  // Estados dos KPIs
  const [totalExamesKpi, setTotalExamesKpi] = useState<string>("0");
  const [taxaSisabKpi, setTaxaSisabKpi] = useState<string>("0%");
  const [populacaoAlvoKpi, setPopulacaoAlvoKpi] = useState<string>("0");
  const [taxaCalculadaKpi, setTaxaCalculadaKpi] = useState<string>("0%");
  const [loadingKpi, setLoadingKpi] = useState<boolean>(false);

  // Estado para a População por Faixa Etária
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<FaixaEtariaItem[]>([]);

  // Estado para os dados do Mapa por UF
  const [dadosMapaUF, setDadosMapaUF] = useState<any[]>([]);

  // Estado para a Tabela de Piores Municípios
  const [dadosTabelaMunicipios, setDadosTabelaMunicipios] = useState<any[]>([]);

  // Estado para o gráfico de evolução
  const [dadosEvolucao, setDadosEvolucao] = useState<EvolucaoColetaItem[]>([]);

  // 1. Carrega os KPIs, o Mapa e a Tabela de Piores Municípios quando o Ano selecionado mudar
  useEffect(() => {
    async function carregarDadosAno() {
      setLoadingKpi(true);

      const [dadosExames, dadosSisab, dadosMapa, dadosPopulacao, dadosTabela] =
        await Promise.all([
          getTotalExamesPapaNicolau(anoSelecionado, "Total"),
          getTotalTaxaSisabPapaNicolau(anoSelecionado, "Total_UF"),
          getColetaPapaNicolauPorEstado(anoSelecionado),
          getPopulacaoAlvoTotal("Brasil"),
          getTop10MenoresCoberturasMunicipios(anoSelecionado), // 👈 BUSCA OS MUNICÍPIOS COM MENOR COBERTURA
        ]);

      // Guarda os dados do Mapa e da Tabela
      setDadosMapaUF(dadosMapa || []);
      setDadosTabelaMunicipios(dadosTabela || []);

      // Variáveis auxiliares para o cálculo da Taxa Calculada
      let examesNum = 0;
      let populacaoNum = 0;

      // Trata KPI de Total de Exames
      if (
        dadosExames &&
        dadosExames.total_exames !== undefined &&
        dadosExames.total_exames !== null
      ) {
        examesNum = Number(dadosExames.total_exames);
        setTotalExamesKpi(examesNum.toLocaleString("pt-BR"));
      } else {
        setTotalExamesKpi("0");
      }

      // Trata KPI de População Alvo Total
      if (
        dadosPopulacao &&
        dadosPopulacao.populacao_alvo_total !== undefined &&
        dadosPopulacao.populacao_alvo_total !== null
      ) {
        populacaoNum = Number(dadosPopulacao.populacao_alvo_total);
        setPopulacaoAlvoKpi(populacaoNum.toLocaleString("pt-BR"));
      } else {
        setPopulacaoAlvoKpi("0");
      }

      // Trata KPI da Taxa Calculada ( Total Exames / População Alvo )
      if (populacaoNum > 0) {
        const taxaCalculada = (examesNum / (populacaoNum / 3)) * 100;
        setTaxaCalculadaKpi(`${taxaCalculada.toFixed(1)}%`);
      } else {
        setTaxaCalculadaKpi("0%");
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

  // 2. Carrega a evolução temporal e a população por faixa etária (uma única vez)
  useEffect(() => {
    async function carregarDadosFixos() {
      const [dadosEvo, dadosFaixa] = await Promise.all([
        getEvolucaoRastreamentoPapaNicolau("Total_UF"),
        getPopulacaoAlvoPorFaixaEtaria("Brasil"),
      ]);

      setDadosEvolucao(dadosEvo || []);
      setDadosFaixaEtaria(dadosFaixa || []);
    }

    carregarDadosFixos();
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
            taxaCalculada={loadingKpi ? "..." : taxaCalculadaKpi}
            populacaoAlvo={loadingKpi ? "..." : populacaoAlvoKpi}
            totalExames={loadingKpi ? "..." : totalExamesKpi}
          />
          <Alvo_Faixa_Etaria dados={dadosFaixaEtaria} loading={loadingKpi} />
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

      {/* TABELA DE MUNICÍPIOS COM DADOS REAIS */}
      <div className="w-full">
        <Tabela_Cobertura_Rastreamento
          anoReferencia={String(anoSelecionado)}
          dados={dadosTabelaMunicipios}
          loading={loadingKpi}
        />
      </div>
    </div>
  );
}