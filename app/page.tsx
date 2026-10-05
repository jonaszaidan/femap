import { supabase } from "../src/lib/supabase";
import Header from "../src/components/Header";
import DashboardClient from "../src/components/Dashboard_Mortalidade_CCU";

export default async function Home() {

  // KPI Nacional
  const {
    data: taxaMortalidadeCCU,
    error: taxaMortalidadeError,
  } = await supabase
    .from("tx_mortalidade_ccu")
    .select("*")
    .ilike("municipio", "%total%");

  // Municípios (Top 10 / Tabelas)
  const {
    data: mortalidadeMunicipios,
    error: mortalidadeMunicipiosError,
  } = await supabase
    .from("tx_mortalidade_ccu")
    .select("*")
    .limit(100000);

  // Estados (Mapa)
  const {
    data: mortalidadeUF,
    error: mortalidadeUFError,
  } = await supabase
    .from("tx_mortalidade_ccu_uf")
    .select("*");

  const erro =
    taxaMortalidadeError ||
    mortalidadeMunicipiosError ||
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
        mortalidadeCCU={taxaMortalidadeCCU || []}
        mortalidadeMunicipios={mortalidadeMunicipios || []}
        mortalidadeUF={mortalidadeUF || []}
      />

    </main>
  );
}