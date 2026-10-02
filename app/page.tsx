import { supabase } from "../src/lib/supabase";
import Header from "../src/components/Header";
import DashboardClient from "../src/components/Dashboard_Mortalidade_CCu";

export default async function Home() {
  // Indicadores municipais (se tiver mais de 1000 linhas, coloque .limit(10000))
  const {
    data: indicadores,
    error: indicadoresError,
  } = await supabase
    .from("indicadores")
    .select("*")
    .limit(10000);

  // Vacinação HPV
  const {
    data: hpv,
    error: hpvError,
  } = await supabase
    .from("vacinacao_hpv")
    .select("*")
    .limit(10000);

  // Mortalidade CCU:
  // Buscamos apenas os registros consolidados de "Total dos Municípios" para todos os anos.
  // Isso traz exatamente as linhas que o KPI precisa (2020 a 2024) sem estourar o limite de 1000!
  const {
    data: mortalidadeCCU,
    error: mortalidadeError,
  } = await supabase
    .from("tx_mortalidade_ccu")
    .select("*")
    .ilike("municipio", "%total%");

  const erro =
    indicadoresError ||
    hpvError ||
    mortalidadeError;


const {
  data: mortalidadeUF,
} = await supabase
  .from("tx_mortalidade_ccu_uf")
  .select("*");    

 return (
  <main className="min-h-screen bg-slate-100 p-8">
    <Header />

    {erro && (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
        Erro ao carregar os dados: {erro.message}
      </div>
    )}

    <DashboardClient
      indicadores={indicadores || []}
      hpv={hpv || []}
      mortalidadeCCU={mortalidadeCCU || []}
      mortalidadeUF={mortalidadeUF || []}
    />

  </main>
);
}
