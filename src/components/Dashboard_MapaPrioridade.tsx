"use client";

import React, { useState, useEffect } from "react";
import DynamicMapaPrioridade from "./Graficos_Mapa_Prioridade/DynamicMapaPrioridade";
import { getDadosMapaPrioridade } from "../services/queries_mapaprioridade/mapaPrioridadeQueries";

export default function DashboardMapaPrioridade() {
  const [anoSelecionado, setAnoSelecionado] = useState("2024");
  const [busca, setBusca] = useState("");
  
  // Estado para armazenar os dados consolidados do Supabase
  const [dadosMunicipios, setDadosMunicipios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const anosDisponiveis = ["2024", "2023", "2022", "2021", "2020"];

  // useEffect para carregar os dados do Supabase sempre que o ano mudar
  useEffect(() => {
    async function carregarDadosMapa() {
      setLoading(true);
      try {
        const dados = await getDadosMapaPrioridade(anoSelecionado);
        setDadosMunicipios(dados);
      } catch (error) {
        console.error("Erro ao carregar dados do mapa de prioridades:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosMapa();
  }, [anoSelecionado]);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO DASHBOARD */}
      <div className="bg-slate-400 text-white rounded-xl px-6 py-3 flex justify-between items-center font-bold text-lg shadow-sm">
        <h2>Mapa de prioridade: Quais municípios devem ser priorizados para ações de prevenção?</h2>
        
        {/* SELETOR DE ANO */}
        <div className="flex items-center gap-2 text-sm font-normal">
          <span>Ano de referência:</span>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
            className="bg-white text-slate-800 font-bold px-3 py-1 rounded-md text-sm outline-none"
          >
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
          {loading && <span className="text-xs text-slate-200 ml-2">Carregando...</span>}
        </div>
      </div>

      {/* CAMPO DE PESQUISA DO MUNICÍPIO */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <input
          type="text"
          placeholder="Pesquisar município..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full px-3 py-1.5 text-sm outline-none text-slate-700"
        />
      </div>

      {/* MAPA PRINCIPAL */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <DynamicMapaPrioridade
          dadosMortalidade={dadosMunicipios} // Passando os dados consolidados com tx_mortalidade
          dadosMunicipios={dadosMunicipios}   // Passando os dados geográficos e do IBGE
          anoSelecionado={anoSelecionado}
          busca={busca}
        />
      </div>
    </div>
  );
}