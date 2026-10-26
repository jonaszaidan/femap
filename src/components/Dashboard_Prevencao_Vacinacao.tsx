"use client";

import React, { useState, useEffect } from "react";

// Componentes da pasta 'Graficos_Prevencao_Vacinacao'
import Kpi_Vacinacao from "./Graficos_Prevencao_Vacinacao/Kpi_Vacinacao";
import Alvo_Faixa_Etaria_Vacinacao from "./Graficos_Prevencao_Vacinacao/Alvo_Faixa_Etaria_Vacinacao";
import DynamicMapaVacinacao from "./Graficos_Prevencao_Vacinacao/DynamicMapaVacinacao";
import Evolucao_Vacinacao from "./Graficos_Prevencao_Vacinacao/Evolucao_Vacinacao";
import Tabela_Cobertura_Vacinacao from "./Graficos_Prevencao_Vacinacao/Tabela_Cobertura_Vacinacao";

// Queries do Supabase para o módulo de Vacinação contra o HPV
import { getVacinacaoPorEstado } from "../services/queries_prevencao_vacinacao/vacinacaoMapaQueries";
import { getKpisVacinacao } from "../services/queries_prevencao_vacinacao/vacinacaoKpisQueries";
import { getPopulacaoAlvoPorFaixaVacinacao } from "../services/queries_prevencao_vacinacao/vacinacaoFaixaPopulacaoQueries";

// Queries do Supabase para o módulo de Evolução Vacinação contra o HPV
import { getEvolucaoVacinacaoBrasil } from "../services/queries_prevencao_vacinacao/vacinacaoEvolucaoQueries";

export default function DashboardPrevencaoVacinacao() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const anosDisponiveis = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

  // Estado para o filtro de sexo ("geral" como padrão, "masculino", "feminino")
  const [sexoSelecionado, setSexoSelecionado] = useState<string>("geral");

  // Estados dos KPIs
  const [taxaCoberturaKpi, setTaxaCoberturaKpi] = useState<string>("0%");
  const [dosesAplicadasKpi, setDosesAplicadasKpi] = useState<string>("0");
  const [populacaoAlvoKpi, setPopulacaoAlvoKpi] = useState<string>("0");

  // Estado para População por Faixa Etária
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<any[]>([]);

  // Estado para os dados do Mapa por UF (Vacinação HPV)
  const [vacinacaoUFAno, setVacinacaoUFAno] = useState<any[]>([]);
  
  // Estado de Carregamento
  const [loading, setLoading] = useState<boolean>(false);
 
  // Estado para a Evolução Temporal da Vacinação
  const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);  

  // Carrega a evolução temporal sempre que o filtro de sexo for alterado
  useEffect(() => {
    async function carregarEvolucao() {
      const dados = await getEvolucaoVacinacaoBrasil(sexoSelecionado);
      setDadosEvolucao(dados);
    }
    carregarEvolucao();
  }, [sexoSelecionado]);

  // Carrega todos os dados assincronamente ao alterar o ano ou o sexo selecionado
  useEffect(() => {
    async function carregarDadosComFiltros() {
      setLoading(true);

      const [dadosMapaVacina, kpis, dadosFaixa] = await Promise.all([
        getVacinacaoPorEstado(anoSelecionado, sexoSelecionado),
        getKpisVacinacao(anoSelecionado, sexoSelecionado),
        getPopulacaoAlvoPorFaixaVacinacao(anoSelecionado, sexoSelecionado),
      ]);

      // Atualiza o estado do Mapa
      setVacinacaoUFAno(dadosMapaVacina || []);

      // Atualiza o estado da População por Faixa Etária (agora contendo feminino e masculino)
      setDadosFaixaEtaria(dadosFaixa || []);

      // Atualiza os valores formatados dos KPIs
      if (kpis) {
        setTaxaCoberturaKpi(`${kpis.taxaCobertura.toFixed(1)}%`);
        setDosesAplicadasKpi(kpis.totalDoses.toLocaleString("pt-BR"));
        setPopulacaoAlvoKpi(kpis.totalPopulacao.toLocaleString("pt-BR"));
      }

      setLoading(false);
    }

    carregarDadosComFiltros();
  }, [anoSelecionado, sexoSelecionado]);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO DASHBOARD COM O SELECT DE ANO E O FILTRO DE SEXO */}
      <div className="bg-[#8B9BB4] text-white rounded-xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <h2 className="text-lg font-bold">Prevenção Primária: Vacinação contra o HPV</h2>

        {/* Grupo de Filtros (Sexo e Ano) */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-normal">
          
          {/* Abas de Filtro de Sexo (Geral como Standard) */}
          <div className="flex items-center bg-white/20 p-1 rounded-lg">
            <button
              onClick={() => setSexoSelecionado("geral")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sexoSelecionado === "geral"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Geral
            </button>
            <button
              onClick={() => setSexoSelecionado("feminino")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sexoSelecionado === "feminino"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Feminino
            </button>
            <button
              onClick={() => setSexoSelecionado("masculino")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                sexoSelecionado === "masculino"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Masculino
            </button>
          </div>

          <span>
            Referência: <strong>Brasil</strong>
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="select-ano-vacinacao">Ano:</label>
            <select
              id="select-ano-vacinacao"
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

      {/* GRID SUPERIOR (KPIs, Faixa Etária e Mapa Dinâmico) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Kpi_Vacinacao
            taxaCobertura={loading ? "..." : taxaCoberturaKpi}
            dosesAplicadas={loading ? "..." : dosesAplicadasKpi}
            populacaoAlvo={loading ? "..." : populacaoAlvoKpi}
          />
          <Alvo_Faixa_Etaria_Vacinacao
            dados={dadosFaixaEtaria}
            loading={loading}
            sexoFiltro={sexoSelecionado}
          />
        </div>

        {/* MAPA DINÂMICO DE VACINAÇÃO COM DADOS REAIS DO SUPABASE */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <DynamicMapaVacinacao vacinacaoUFAno={vacinacaoUFAno} loading={loading} />
        </div>
      </div>

      {/* EVOLUÇÃO TEMPORAL DA COBERTURA */}
      <div className="w-full">
        <Evolucao_Vacinacao dados={dadosEvolucao} referencia="Brasil" />
      </div>

      {/* TABELA DE MUNICÍPIOS DE VACINAÇÃO */}
      <div className="w-full">
        <Tabela_Cobertura_Vacinacao anoReferencia={String(anoSelecionado)} />
      </div>
    </div>
  );
}