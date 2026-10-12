"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import TabelaTop10Municipios from "./Graficos_Mortalidade/TabelaTop10Municipios";
import KpiCards from "./Graficos_Mortalidade/KpiCards";
// 1. Importe a função de queries que criamos (ajuste o caminho se necessário)

import { getKpiMortalidadeResumo } from "../services/queries_mortalidade/mortalidadeKpiQueries";
import { getMortalidadePorEstado } from "../services/queries_mortalidade/mortalidadeMapasQueries";
import { getTop10Mortalidade } from "../services/queries_mortalidade/mortalidadeTabelaQueries";
// Importação dinâmica do mapa (desabilitando SSR)
const MapaMortalidadeUF = dynamic(
  () => import("./Graficos_Mortalidade/MapaMortalidadeUF"),
  { ssr: false }
);

// Importação dinâmica do gráfico de evolução (desabilitando SSR)
const EvolucaoAbsolutaChart = dynamic(
  () => import("./Graficos_Mortalidade/EvolucaoMortalidade_CCU"),
  { ssr: false }
);

interface MortalidadeCCU {
  id?: number;
  municipio: string;
  ano: number;
  tx_mortalidade: number;
  codigo_ibge?: string;
}

interface MortalidadeUF {
  uf: string;
  estado: string;
  ano: number;
  tx_mortalidade_ccu: number;
}

export default function Dashboard() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);

  // Estados locais para armazenar os dados vindos do Supabase
  const [taxaBrasil, setTaxaBrasil] = useState<number | string>("0.00");
  const [totalObitos, setTotalObitos] = useState<number | string>(0);
  const [piorEstado, setPiorEstado] = useState<{ estado: string; taxa: number } | null>(null);
  
  const [mortalidadeMunicipiosAno, setMortalidadeMunicipiosAno] = useState<MortalidadeCCU[]>([]);
  const [mortalidadeUFAno, setMortalidadeUFAno] = useState<MortalidadeUF[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. useEffect para buscar os dados do Supabase sempre que o ano mudar
  useEffect(() => {
    async function carregarDadosDoAno() {
      setLoading(true);
      try {
        // dos chamando a query para o mapa por estados  KPI 1 (usando o filtro)
        const resumoKpi = await getKpiMortalidadeResumo(anoSelecionado);
        setTaxaBrasil(resumoKpi.taxaBrasil);
        setTotalObitos(resumoKpi.totalObitos);
        setPiorEstado(resumoKpi.piorEstado);


       // Dados chamando a query para o mapa por estados 
       const dadosEstados = await getMortalidadePorEstado(anoSelecionado);
        setMortalidadeUFAno(dadosEstados);


// Mapeia as colunas do banco ('estado' e 'tx_mortalidade_ccu') 
// para o formato que a tabela usa ('tx_mortalidade')
  const dadosTop10 = await getTop10Mortalidade(anoSelecionado);

  const dadosFormatados = dadosTop10.map((item) => ({
    municipio: item.estado, // Passando o estado na propriedade que a tabela lê como nome principal
    uf: item.uf,
    tx_mortalidade: item.tx_mortalidade_ccu,
    ab_mortalidade: item.ab_mortalidade_ccu
  }));

setMortalidadeMunicipiosAno(dadosFormatados);



      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDoAno();
  }, [anoSelecionado]);


  

  {/* Calculo da tabela de top municipios */}
  const top10Municipios = [...mortalidadeMunicipiosAno]
    .sort((a, b) => Number(b.tx_mortalidade) - Number(a.tx_mortalidade))
    .slice(0, 10);

  // DADOS DO GRÁFICO (Mantidos estáticos por enquanto ou podem vir de outra query)
  const dadosEvolucao = [
    { ano: "2021", mortalidade: 4.3, incidencia: 2.4, hsil: 2.0 },
    { ano: "2022", mortalidade: 2.5, incidencia: 4.4, hsil: 2.0 },
    { ano: "2023", mortalidade: 3.5, incidencia: 1.8, hsil: 3.0 },
    { ano: "2024", mortalidade: 4.5, incidencia: 2.8, hsil: 5.0 },
  ];

  return (
    <>
      {/* 1. FILTRO GLOBAL DE ANO */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label htmlFor="ano" className="text-sm font-semibold text-slate-600">
            Ano de referência
          </label>
          <select
            id="ano"
            value={anoSelecionado}
            onChange={(event) => setAnoSelecionado(Number(event.target.value))}
            className="border border-slate-300 rounded-lg px-4 py-2 bg-white"
          >
            <option value={2020}>2020</option>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
          {loading && <span className="text-sm text-slate-400">Carregando dados...</span>}
        </div>
      </div>

      {/* 2. CARDS DE KPI (Passando os estados dinâmicos agora) */}
      <div className="mb-8">
        <KpiCards 
          taxaMortalidadeCCU={taxaBrasil} 
          totalObitos={totalObitos} 
          piorEstado={piorEstado} 
        />
      </div>

      {/* 3. GRÁFICO DE EVOLUÇÃO */}
      <div className="mb-8">
        <EvolucaoAbsolutaChart data={dadosEvolucao} />
      </div>

      {/* 4. SEÇÃO TAXAS POR ESTADO (3 MAPAS NO TOPO) */}
      <div className="mb-8">
        <div className="bg-slate-400 text-white rounded-xl px-6 py-3 mb-6 flex justify-between items-center font-bold text-lg">
          <h2>Taxas por estado</h2>
          <span className="text-sm font-normal">Ano de referência: {anoSelecionado}</span>
        </div>

        {/* Grid de 3 Mapas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-3xl border border-[#67001f]/20 shadow-sm" style={{ backgroundColor: "rgba(103, 0, 31, 0.05)" }}>
            <h3 className="text-center font-bold text-[#67001f] mb-2">Mortalidade</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="purple" />*
          </div>
        

          <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h3 className="text-center font-bold text-amber-900 mb-2">Incidência</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="orange" />
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 shadow-sm">
            <h3 className="text-center font-bold text-emerald-900 mb-2">HSIL</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="green" />
          </div>
        </div>
      </div>

      {/* 5. SEÇÃO DAS 3 TABELAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior Mortalidade"
          dados={top10Municipios}
          corTextoTaxa="text-pink-600"
        />

        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior Incidência"
          dados={top10Municipios} 
          corTextoTaxa="text-amber-600"
        />

        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior HSIL"
          dados={top10Municipios} 
          corTextoTaxa="text-emerald-600"
        />
      </div>
    </>
  );
}