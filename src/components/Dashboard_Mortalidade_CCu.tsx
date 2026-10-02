"use client";


import dynamic from "next/dynamic";
import { useState } from "react";

const MapaMortalidadeUF = dynamic(
  () => import("./MapaMortalidadeUF"),
  {
    ssr: false,
  }
);


interface HPV {
  id?: number;
  uf: string;
  municipio?: string;
  sexo?: string;
  ano?: number;
  faixa_etaria: string;
  cobertura: number;
  doses?: number;
  populacao?: number;
}

interface MortalidadeCCU {
  id?: number;
  municipio: string;
  ano: number;
  tx_mortalidade: number;
  codigo_ibge?: string;
}
interface Indicador {
  id: number;
  municipio: string;
  estado: string;
  ano?: number;
  mortalidade: number;
  vacinacao_hpv: number;
  rastreamento: number;
  latitude: number;
  longitude: number;
}

interface DashboardProps {
  indicadores?: Indicador[];
  hpv?: HPV[];
  mortalidadeCCU?: MortalidadeCCU[];
  mortalidadeUF?: MortalidadeUF[];
}

interface MortalidadeUF {
  uf: string;
  estado: string;
  ano: number;
  tx_mortalidade_ccu: number;
}


export default function Dashboard({
  indicadores = [],
  hpv = [],
  mortalidadeCCU = [],
  mortalidadeUF = [],
}: DashboardProps) {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);

  // 1. Filtra registros do ano selecionado
  const mortalidadeAno = (mortalidadeCCU || []).filter(
    (item) => Number(item?.ano) === Number(anoSelecionado)
  );

  // 2. Busca a linha de total ignorando acentos e maiúsculas
  const totalMunicipios = mortalidadeAno.find((item) => {
    if (!item?.municipio) return false;
    const nomeLimpo = item.municipio
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    return nomeLimpo.includes("total") && nomeLimpo.includes("municipio");
  });
console.log("Exemplo de item do banco:", mortalidadeCCU[0]);
  console.log("1. Array original mortalidadeCCU:", mortalidadeCCU);
console.log("2. Ano Selecionado:", anoSelecionado);
console.log("3. Array filtrado mortalidadeAno:", mortalidadeAno);
console.log("4. totalMunicipios:", totalMunicipios);
  const taxaMortalidadeCCU =
    totalMunicipios?.tx_mortalidade != null
      ? Number(totalMunicipios.tx_mortalidade).toFixed(2)
      : "0.00";

  // 3. Filtro HPV seguro
  const hpvAno = (hpv || []).filter((item) => {
    const faixaCorreta = item?.faixa_etaria === "9-14";
    if (item?.ano !== undefined && item?.ano !== null) {
      return faixaCorreta && Number(item.ano) === Number(anoSelecionado);
    }
    return faixaCorreta;
  });

  // 4. Filtro Indicadores seguro
  const indicadoresAno = (indicadores || []).filter((item) => {
    if (item?.ano !== undefined && item?.ano !== null) {
      return Number(item.ano) === Number(anoSelecionado);
    }
    return true;
  });

  // 5. Média da mortalidade municipal
  const mediaMortalidade =
    indicadoresAno.length > 0
      ? (
          indicadoresAno.reduce(
            (acc, item) => acc + Number(item.mortalidade || 0),
            0
          ) / indicadoresAno.length
        ).toFixed(1)
      : "0.0";
    // 6. Mapa por Municipio (em construção)    
  



const mortalidadeUFAno =
  (mortalidadeUF || []).filter(
    (item: MortalidadeUF) =>
      Number(item.ano) === Number(anoSelecionado)
  );





  return (
    <>
      {/* FILTRO GLOBAL DE ANO */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label
            htmlFor="ano"
            className="text-sm font-semibold text-slate-600"
          >
            Ano de referência
          </label>

          <select
            id="ano"
            value={anoSelecionado}
            onChange={(event) =>
              setAnoSelecionado(Number(event.target.value))
            }
            className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2020}>2020</option>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Tx. Mortalidade CCU</h2>
          <p className="text-4xl font-bold text-red-600 mt-1">
            {taxaMortalidadeCCU}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            média das taxas municipais
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ano {anoSelecionado}
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Taxa de Mortalidade CCU</h2>
          <p className="text-4xl font-bold text-red-600 mt-1">
            {taxaMortalidadeCCU}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            por 100.000 mulheres
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ano {anoSelecionado}
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Média Mortalidade</h2>
          <p className="text-4xl font-bold text-red-600 mt-1">
            {mediaMortalidade}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Ano {anoSelecionado}
          </p>
        </div>
      </div>

    <h3 className="text-xl font-semibold mb-4">
  Mortalidade por Estado
</h3>

<p className="text-sm text-gray-500 mb-4">
  Taxa de mortalidade por câncer do colo do útero por 100.000 mulheres
</p>

  {/* MAPA UF */}
<MapaMortalidadeUF
  mortalidadeUFAno={mortalidadeUFAno}
/>

    </>
  );
}