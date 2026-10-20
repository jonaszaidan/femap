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

// Queries do Supabase para o módulo de Evolucação Vacinação contra o HPV
import { getEvolucaoVacinacaoBrasil } from "../services/queries_prevencao_vacinacao/vacinacaoEvolucaoQueries";

export default function DashboardPrevencaoVacinacao() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);
  const anosDisponiveis = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

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
 
  // Estado do componente Evolucao PrevencaoVacinacao:
const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);  


useEffect(() => {
  async function carregarEvolucao() {
    const dados = await getEvolucaoVacinacaoBrasil();
    setDadosEvolucao(dados);
  }
  carregarEvolucao();
}, []);

  // Carrega todos os dados assincronamente ao alterar o ano selecionado
  useEffect(() => {
    async function carregarDadosAno() {
      setLoading(true);

      const [dadosMapaVacina, kpis, dadosFaixa] = await Promise.all([
        getVacinacaoPorEstado(anoSelecionado),
        getKpisVacinacao(anoSelecionado),
        getPopulacaoAlvoPorFaixaVacinacao(anoSelecionado),
      ]);

      

      // Atualiza o estado do Mapa
      setVacinacaoUFAno(dadosMapaVacina || []);

      // Atualiza o estado da População por Faixa Etária
      setDadosFaixaEtaria(dadosFaixa || []);

      // Atualiza os valores formatados dos KPIs
      if (kpis) {
        setTaxaCoberturaKpi(`${kpis.taxaCobertura.toFixed(1)}%`);
        setDosesAplicadasKpi(kpis.totalDoses.toLocaleString("pt-BR"));
        setPopulacaoAlvoKpi(kpis.totalPopulacao.toLocaleString("pt-BR"));
      }

      setLoading(false);
    }

    carregarDadosAno();
  }, [anoSelecionado]);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO DASHBOARD COM O SELECT DE ANO */}
      <div className="bg-[#8B9BB4] text-white rounded-xl px-6 py-3 flex justify-between items-center font-bold text-lg shadow-sm">
        <h2>Prevenção Primária: Vacinação contra o HPV</h2>

        <div className="flex items-center gap-4 text-sm font-normal">
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