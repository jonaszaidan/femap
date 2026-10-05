"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import TabelaTop10Municipios from "./Graficos/TabelaTop10Municipios";
import KpiCards from "./Graficos/KpiCards";

// Importação dinâmica do mapa (desabilitando SSR)
const MapaMortalidadeUF = dynamic(
  () => import("./Graficos/MapaMortalidadeUF"),
  { ssr: false }
);

// Importação dinâmica do gráfico de evolução (desabilitando SSR)
const EvolucaoAbsolutaChart = dynamic(
  () => import("./Graficos/EvolucaoMortalidade_CCU"),
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

interface DashboardProps {
  mortalidadeCCU?: MortalidadeCCU[];
  mortalidadeMunicipios?: MortalidadeCCU[];
  mortalidadeUF?: MortalidadeUF[];
}

export default function Dashboard({
  mortalidadeCCU = [],
  mortalidadeMunicipios = [],
  mortalidadeUF = [],
}: DashboardProps) {

  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);

  const mortalidadeAno = mortalidadeCCU.filter(
    (item) => Number(item.ano) === Number(anoSelecionado)
  );

  const totalMunicipios = mortalidadeAno.find((item) => {
    if (!item.municipio) return false;

    const nomeLimpo = item.municipio
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    return (
      nomeLimpo.includes("total") &&
      nomeLimpo.includes("municipio")
    );
  });

  const taxaMortalidadeCCU =
    totalMunicipios?.tx_mortalidade != null
      ? Number(totalMunicipios.tx_mortalidade).toFixed(2)
      : "0.00";

  const mortalidadeMunicipiosAno = mortalidadeMunicipios.filter(
    (item) =>
      Number(item.ano) === Number(anoSelecionado) &&
      !item.municipio.toLowerCase().includes("total")
  );

  const mediaMortalidade =
    mortalidadeMunicipiosAno.length > 0
      ? (
          mortalidadeMunicipiosAno.reduce(
            (acc, item) => acc + Number(item.tx_mortalidade),
            0
          ) / mortalidadeMunicipiosAno.length
        ).toFixed(1)
      : "0.0";

  {/* Calculo da tabela de top municipios */}
  const top10Municipios = [...mortalidadeMunicipiosAno]
    .sort((a, b) => Number(b.tx_mortalidade) - Number(a.tx_mortalidade))
    .slice(0, 10);

  {/* Calculo do KPI 3 */}
  const municipioPiorTaxa =
    top10Municipios.length > 0 ? top10Municipios[0] : null;

  const mortalidadeUFAno = mortalidadeUF.filter(
    (item) => Number(item.ano) === Number(anoSelecionado)
  );

  // 🟢 ITEM 2: DADOS DO GRÁFICO
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
        </div>
      </div>

    {/* 2. CARDS DE KPI */}
      
       
        <KpiCards taxaMortalidadeCCU={taxaMortalidadeCCU} />
      

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
          {/* Mapa 1: Mortalidade (Tema Roxo/Rosa) */}
          <div className="bg-purple-50/50 p-4 rounded-3xl border border-purple-100 shadow-sm">
            <h3 className="text-center font-bold text-purple-900 mb-2">Mortalidade</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="purple" />
          </div>

          {/* Mapa 2: Incidência (Tema Laranja) */}
          <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100 shadow-sm">
            <h3 className="text-center font-bold text-amber-900 mb-2">Incidência</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="orange" />
          </div>

          {/* Mapa 3: HSIL (Tema Verde) */}
          <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100 shadow-sm">
            <h3 className="text-center font-bold text-emerald-900 mb-2">HSIL</h3>
            <MapaMortalidadeUF mortalidadeUFAno={mortalidadeUFAno} tema="green" />
          </div>
        </div>
      </div>

      {/* 5. SEÇÃO DAS 3 TABELAS (EMBAIXO DOS MAPAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior Mortalidade"
          dados={top10Municipios}
          corTextoTaxa="text-pink-600"
        />

        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior Incidência"
          dados={top10Municipios} /* Ajuste para a variável de incidência quando tiver */
          corTextoTaxa="text-amber-600"
        />

        <TabelaTop10Municipios
          titulo="Top 10 Municípios - Maior HSIL"
          dados={top10Municipios} /* Ajuste para a variável de HSIL quando tiver */
          corTextoTaxa="text-emerald-600"
        />
      </div>
    </>
  );
}