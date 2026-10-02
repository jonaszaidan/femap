import { supabase } from "../src/lib/supabase";
import MortalidadeChart from "../src/components/MortalidadeChart";
import Header from "../src/components/Header";
import dynamic from "next/dynamic";
import MapaMunicipios from "../src/components/MapaMunicipios";
import MapaHPVUF from "../src/components/MapaHPVUF";


export default async function Home() {

  const { data: indicadores, error } = await supabase
    .from("indicadores")
    .select("*");

  const {
    data: hpv,
    error: hpvError,
  } = await supabase
    .from("vacinacao_hpv")
    .select("*")
    .eq("faixa_etaria", "9-14");
    console.log(hpv?.[0]);

 

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Erro: {error.message}
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">Municípios</h2>

          <p className="text-3xl font-bold">
            {indicadores?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Média Vacinação HPV
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {Math.round(
              (indicadores?.reduce(
                (acc, item) =>
                  acc + Number(item.vacinacao_hpv),
                0
              ) || 0) /
                (indicadores?.length || 1)
            )}
            %
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Média Mortalidade
          </h2>

          <p className="text-3xl font-bold text-red-600">
            {(
              (indicadores?.reduce(
                (acc, item) =>
                  acc + Number(item.mortalidade),
                0
              ) || 0) /
              (indicadores?.length || 1)
            ).toFixed(1)}
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">
          Indicadores Municipais
        </h2>

        {/* GRÁFICO */}
        <div className="mt-8">
          <MortalidadeChart
            dados={indicadores || []}
          />
        </div>

        {/* LEGENDA */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Baixo risco (&lt; 3)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Médio risco (3 a 4.5)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Alto risco (&gt; 4.5)</span>
          </div>
        </div>

        {/* MAPAS */}
        {/* MAPAS */}
<div className="grid grid-cols-2 gap-6 mt-8">

      <MapaMunicipios
        titulo="Mortalidade"
        dados={indicadores || []}
        metrica="mortalidade"
      />

     <MapaHPVUF
   dados={hpv || []}
      />


</div>

       

        {/* TABELA */}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Município</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Mortalidade</th>
              <th className="text-left p-2">HPV (%)</th>
              <th className="text-left p-2">Rastreamento (%)</th>
            </tr>
          </thead>



          <tbody>
            {indicadores?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.municipio}</td>
                <td className="p-2">{item.estado}</td>
                <td className="p-2">{item.mortalidade}</td>
                <td className="p-2">{item.vacinacao_hpv}</td>
                <td className="p-2">{item.rastreamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
    </main>
  );
}
