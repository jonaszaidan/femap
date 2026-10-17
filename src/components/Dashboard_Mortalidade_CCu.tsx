"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Tabelas Estaduais
import TabelaTop10Estados from "./Graficos_Mortalidade/TabelaHsilUF";

// Tabelas Municipais Novas
import TabelaMortalidadeMunicipios from "./Graficos_Mortalidade/TabelaMortalidadeMunicipios";
import TabelaHsilMunicipios from "./Graficos_Mortalidade/TabelaHsilMunicipios";

import KpiCards from "./Graficos_Mortalidade/KpiCards";

// 1. Importações das queries de Mortalidade
import { getKpiMortalidadeResumo } from "../services/queries_mortalidade/mortalidadeKpiQueries";
import {
  getMortalidadePorEstado,
  getMortalidadePorMunicipio,
  UF_PARA_CODIGO_IBGE,
} from "../services/queries_mortalidade/mortalidadeMapasMunicipiosQueries";
import { getTop10Mortalidade } from "../services/queries_mortalidade/mortalidadeTabelaQueries";
import { getTop10MortalidadeMunicipios } from "../services/queries_mortalidade/mortalidadeTabelaMunicipiosQueries";

// 2. Importações das queries de HSIL
import { getKpiHsilResumo } from "../services/queries_mortalidade/hsilKpiQueries";
import { getHsilPorEstado } from "../services/queries_mortalidade/hsilMapasQueries";
import { getHsilPorMunicipio } from "../services/queries_mortalidade/hsilMapasMunicipioQueries";
import { getTop10Hsil } from "../services/queries_mortalidade/hsilTabelaQueries";
import { getTop10HsilMunicipios } from "../services/queries_mortalidade/hsilTabelaMunicipiosQueries";

// 3. Query da Evolução
import { getEvolucaoMortalidadeHSIL } from "../services/queries_mortalidade/mortalidadeEvolucaoQueries";

// Importações dinâmicas dos mapas e gráficos
const MapaMortalidadeUF = dynamic(
  () => import("./Graficos_Mortalidade/MapaMortalidadeUF"),
  { ssr: false }
);

const MapaMortalidadeHsilUF = dynamic(
  () => import("./Graficos_Mortalidade/MapaMortalidade_HsilUF"),
  { ssr: false }
);

const MapaMortalidadeMunicipios = dynamic(
  () => import("./Graficos_Mortalidade/MapaMortalidadeMunicipios"),
  { ssr: false }
);

const MapaMortalidadeHsilMunicipios = dynamic(
  () => import("./Graficos_Mortalidade/MapaMortalidade_Hsil_Municipios"),
  { ssr: false }
);

const EvolucaoAbsolutaChart = dynamic(
  () => import("./Graficos_Mortalidade/EvolucaoMortalidade_CCU"),
  { ssr: false }
);

// Lista de UFs para o Select de Municípios
const LISTA_UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

// Interfaces
interface DadosEstado {
  id?: number;
  estado?: string;
  uf: string;
  ano?: number;
  tx_mortalidade?: number;
  tx_mortalidade_ccu?: number;
  tx_hsil_uf?: number;
  taxa?: number;
  ab_mortalidade?: number;
}

interface DadosUF {
  uf: string;
  estado: string;
  ano: number;
  tx_mortalidade_ccu?: number;
  tx_hsil_uf?: number;
}

export default function Dashboard() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);

  // ESTADOS DO FILTRO DE VISÃO
  const [visao, setVisao] = useState<"estado" | "municipio">("estado");
  const [ufSelecionada, setUfSelecionada] = useState<string>("MG");

  // Estados locais de dados
  const [taxaBrasilMortalidade, setTaxaBrasilMortalidade] = useState<number | string>("0.00");
  const [totalObitos, setTotalObitos] = useState<number | string>(0);
  const [piorEstadoMortalidade, setPiorEstadoMortalidade] = useState<{ estado: string; taxa: number } | null>(null);
  
  const [taxaBrasilHsil, setTaxaBrasilHsil] = useState<number | string>("0.00");
  const [totalResultadosHsil, setTotalResultadosHsil] = useState<number | string>(0);
  const [piorEstadoHsil, setPiorEstadoHsil] = useState<{ estado: string; taxa: number } | null>(null);

  // Estados de Estado (UF)
  const [mortalidadeEstadosAno, setMortalidadeEstadosAno] = useState<DadosEstado[]>([]);
  const [mortalidadeUFAno, setMortalidadeUFAno] = useState<DadosUF[]>([]);
  const [hsilUFAno, setHsilUFAno] = useState<DadosUF[]>([]);
  const [hsilTop10, setHsilTop10] = useState<any[]>([]);

  // Estados de Município
  const [mortalidadeMunicipiosAno, setMortalidadeMunicipiosAno] = useState<any[]>([]);
  const [hsilMunicipiosAno, setHsilMunicipiosAno] = useState<any[]>([]);
  const [top10MortalidadeMun, setTop10MortalidadeMun] = useState<any[]>([]);
  const [top10HsilMun, setTop10HsilMun] = useState<any[]>([]);

  const [dadosEvolucao, setDadosEvolucao] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Carrega a evolução temporal (uma única vez)
  useEffect(() => {
    async function carregarEvolucao() {
      try {
        const dados = await getEvolucaoMortalidadeHSIL("Total_UF");
        setDadosEvolucao(dados);
      } catch (error) {
        console.error("Erro ao carregar evolução:", error);
      }
    }
    carregarEvolucao();
  }, []);

  // 2. Busca dados baseados em Ano, Visão (Estado/Município) e UF Selecionada
  useEffect(() => {
    async function carregarDadosDoAno() {
      setLoading(true);
      try {
        // KPIs Globais
        const resumoMortalidade = await getKpiMortalidadeResumo(anoSelecionado);
        setTaxaBrasilMortalidade(resumoMortalidade.taxaBrasil);
        setTotalObitos(resumoMortalidade.totalObitos);
        setPiorEstadoMortalidade(resumoMortalidade.piorEstado);

        const resumoHsil = await getKpiHsilResumo(anoSelecionado);
        setTaxaBrasilHsil(resumoHsil.taxaBrasil);
        setTotalResultadosHsil(resumoHsil.totalResultados);
        setPiorEstadoHsil(resumoHsil.piorEstado);

        // Mapas/Tabelas conforme a visão selecionada
        if (visao === "estado") {
          const dadosEstados = await getMortalidadePorEstado(anoSelecionado);
          setMortalidadeUFAno(dadosEstados);

          const dadosHsilEstados = await getHsilPorEstado(anoSelecionado);
          setHsilUFAno(dadosHsilEstados);

          const dadosTop10Hsil = await getTop10Hsil(anoSelecionado);
          setHsilTop10(dadosTop10Hsil);

          const dadosTop10Mortalidade = await getTop10Mortalidade(anoSelecionado);
          const dadosFormatadosMortalidade: DadosEstado[] = dadosTop10Mortalidade.map((item: any) => {
            const valorTaxa = item.tx_mortalidade_ccu ?? item.tx_mortalidade ?? item.taxa ?? 0;
            return {
              estado: item.estado || item.uf, 
              uf: item.uf,
              taxa: valorTaxa,
              tx_mortalidade: valorTaxa,
              tx_mortalidade_ccu: valorTaxa,
              tx_hsil_uf: valorTaxa,
              ab_mortalidade: item.ab_mortalidade_ccu || 0
            };
          });
          setMortalidadeEstadosAno(dadosFormatadosMortalidade);
        } else {
          // Visão de Município
          const codigoIbgeUf = UF_PARA_CODIGO_IBGE[ufSelecionada as keyof typeof UF_PARA_CODIGO_IBGE] || "31";
          
          // Busca Mapas e Top 10 Municipais em paralelo
          const [
            dadosMunicipais, 
            dadosHsilMunicipais,
            top10MortMunData,
            top10HsilMunData
          ] = await Promise.all([
            getMortalidadePorMunicipio(anoSelecionado, codigoIbgeUf),
            getHsilPorMunicipio(anoSelecionado, codigoIbgeUf),
            getTop10MortalidadeMunicipios(anoSelecionado, codigoIbgeUf),
            getTop10HsilMunicipios(anoSelecionado, codigoIbgeUf)
          ]);

          setMortalidadeMunicipiosAno(dadosMunicipais);
          setHsilMunicipiosAno(dadosHsilMunicipais);
          setTop10MortalidadeMun(top10MortMunData);
          setTop10HsilMun(top10HsilMunData);
        }

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosDoAno();
  }, [anoSelecionado, visao, ufSelecionada]);

  // Top 10 Estados
  const top10Mortalidade = [...mortalidadeEstadosAno]
    .sort((a, b) => Number(b.taxa || b.tx_mortalidade || 0) - Number(a.taxa || a.tx_mortalidade || 0))
    .slice(0, 10);

  const top10Incidencia: any[] = [];

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
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          {loading && <span className="text-sm text-slate-400">Carregando dados...</span>}
        </div>
      </div>

      {/* 2. LINHA DE CARDS DE KPI */}
      <div className="mb-8">
        <h3 className="text-md font-bold text-slate-700 mb-2">
          Indicadores Principais (Ano: {anoSelecionado})
        </h3>
        <KpiCards 
          taxaMortalidadeCCU={taxaBrasilMortalidade} 
          totalObitos={totalObitos} 
          piorEstadoMortalidade={piorEstadoMortalidade} 
          taxaHsil={taxaBrasilHsil}
          totalResultadosHsil={totalResultadosHsil}
          piorEstadoHsil={piorEstadoHsil}
        />
      </div>

      {/* 3. GRÁFICO DE EVOLUÇÃO */}
      <div className="mb-8">
        <EvolucaoAbsolutaChart data={dadosEvolucao} />
      </div>

      {/* 4. SEÇÃO TAXAS COM ALTERNÂNCIA (ESTADO vs MUNICÍPIO) */}
      <div className="mb-8">
        <div className="bg-slate-400 text-white rounded-xl px-6 py-3 mb-6 flex flex-wrap justify-between items-center font-bold text-lg shadow-sm gap-4">
          <h2>
            {visao === "estado"
              ? "Taxas por Estado"
              : `Taxas por Município (${ufSelecionada})`}
          </h2>

          <div className="flex items-center gap-4 text-sm font-normal">
            {/* TOGGLE ESTADO / MUNICÍPIO */}
            <div className="flex items-center bg-slate-500 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setVisao("estado")}
                className={`px-3 py-1 rounded-md transition-colors font-medium text-xs ${
                  visao === "estado"
                    ? "bg-white text-slate-800 shadow-sm font-bold"
                    : "text-white hover:text-slate-200"
                }`}
              >
                Estado (UF)
              </button>
              <button
                type="button"
                onClick={() => setVisao("municipio")}
                className={`px-3 py-1 rounded-md transition-colors font-medium text-xs ${
                  visao === "municipio"
                    ? "bg-white text-slate-800 shadow-sm font-bold"
                    : "text-white hover:text-slate-200"
                }`}
              >
                Município
              </button>
            </div>

            {/* SELETOR DE UF (Aparece apenas se visão = município) */}
            {visao === "municipio" && (
              <div className="flex items-center gap-1.5">
                <label htmlFor="select-uf" className="text-white text-xs font-semibold">
                  UF:
                </label>
                <select
                  id="select-uf"
                  value={ufSelecionada}
                  onChange={(e) => setUfSelecionada(e.target.value)}
                  className="bg-white text-slate-800 border border-slate-300 rounded-md px-2.5 py-1 text-xs font-bold shadow-sm focus:outline-none cursor-pointer"
                >
                  {LISTA_UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SELETOR DE ANO */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="ano-mapas" className="text-white text-xs font-semibold">
                Ano:
              </label>
              <select
                id="ano-mapas"
                value={anoSelecionado}
                onChange={(event) => setAnoSelecionado(Number(event.target.value))}
                className="bg-white text-slate-800 border border-slate-300 rounded-md px-2.5 py-1 text-xs font-bold shadow-sm focus:outline-none cursor-pointer"
              >
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID DOS MAPAS */}
        {visao === "estado" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mapa 1 - Mortalidade Estado */}
            <div className="p-4 rounded-3xl border border-[#67001f]/20 shadow-sm" style={{ backgroundColor: "rgba(103, 0, 31, 0.05)" }}>
              <h3 className="text-center font-bold text-[#67001f] mb-2">Mortalidade</h3>
              <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} />
            </div>

            {/* Mapa 2 - Incidência Estado */}
            <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
              <h3 className="text-center font-bold text-amber-900 mb-2">Incidência</h3>
              <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno || []} />
            </div>

            {/* Mapa 3 - HSIL Estado */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 shadow-sm">
              <h3 className="text-center font-bold text-emerald-900 mb-2">HSIL</h3>
              <MapaMortalidadeHsilUF hsilUFAno={hsilUFAno} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mapa 1 - Mortalidade Municípios */}
            <div className="p-4 rounded-3xl border border-[#67001f]/20 shadow-sm" style={{ backgroundColor: "rgba(103, 0, 31, 0.05)" }}>
              <h3 className="text-center font-bold text-[#67001f] mb-2">
                Mortalidade Municipal ({ufSelecionada})
              </h3>
              <MapaMortalidadeMunicipios
                mortalidadeMunicipiosAno={mortalidadeMunicipiosAno}
                codigoUfIbge={UF_PARA_CODIGO_IBGE[ufSelecionada as keyof typeof UF_PARA_CODIGO_IBGE]}
              />
            </div>

            {/* Mapa 2 - Incidência Municípios */}
            <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
              <h3 className="text-center font-bold text-amber-900 mb-2">
                Incidência Municipal ({ufSelecionada})
              </h3>
              <MapaMortalidadeMunicipios
                mortalidadeMunicipiosAno={[]}
                codigoUfIbge={UF_PARA_CODIGO_IBGE[ufSelecionada as keyof typeof UF_PARA_CODIGO_IBGE]}
              />
            </div>

            {/* Mapa 3 - HSIL Municípios */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 shadow-sm">
              <h3 className="text-center font-bold text-emerald-900 mb-2">
                HSIL Municipal ({ufSelecionada})
              </h3>
              <MapaMortalidadeHsilMunicipios
                hsilMunicipiosAno={hsilMunicipiosAno}
                codigoUfIbge={UF_PARA_CODIGO_IBGE[ufSelecionada as keyof typeof UF_PARA_CODIGO_IBGE]}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. SEÇÃO DAS TABELAS (CHAVEAMENTO ESTADO vs MUNICÍPIO) */}
      {visao === "estado" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TabelaTop10Estados
            titulo="Top 10 Estados - Maior Mortalidade"
            dados={top10Mortalidade}
            corTextoTaxa="text-pink-600"
          />

          <TabelaTop10Estados
            titulo="Top 10 Estados - Maior Incidência"
            dados={top10Incidencia} 
            corTextoTaxa="text-amber-600"
          />

          <TabelaTop10Estados
            titulo="Top 10 Estados - Maior HSIL"
            dados={hsilTop10} 
            corTextoTaxa="text-emerald-600"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TabelaMortalidadeMunicipios
            titulo={`Top 10 Municípios - Maior Mortalidade (${ufSelecionada})`}
            dados={top10MortalidadeMun}
            corTextoTaxa="text-pink-600"
          />

          <TabelaMortalidadeMunicipios
            titulo={`Top 10 Municípios - Maior Incidência (${ufSelecionada})`}
            dados={[]} 
            corTextoTaxa="text-amber-600"
          />

          <TabelaHsilMunicipios
            titulo={`Top 10 Municípios - Maior HSIL (${ufSelecionada})`}
            dados={top10HsilMun}
            corTextoTaxa="text-emerald-600"
          />
        </div>
      )}
    </>
  );
}