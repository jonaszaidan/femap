import { supabase } from "../src/lib/supabase";
import Header from "../src/components/Header";
import DashboardClient from "../src/components/Dashboard_Mortalidade_CCU";

export default async function Home() {
  const {
    data: indicadores,
    error: indicadoresError,
  } = await supabase
    .from("indicadores")
    .select("*")
    .limit(10000);

  const {
    data: hpv,
    error: hpvError,
  } = await supabase
    .from("vacinacao_hpv")
    .select("*")
    .limit(10000);

  const {
    data: mortalidadeCCU,
    error: mortalidadeError,
  } = await supabase
    .from("tx_mortalidade_ccu")
    .select("*")
    .ilike("municipio", "%total%");

  const {
    data: mortalidadeUF,
    error: mortalidadeUFError,
  } = await supabase
    .from("tx_mortalidade_ccu_uf")
    .select("*");

  const erro =
    indicadoresError ||
    hpvError ||
    mortalidadeError ||
    mortalidadeUFError;

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