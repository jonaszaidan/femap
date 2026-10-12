import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardMortalidade from "../../components/Dashboard_Mortalidade_CCU";

export const revalidate = 0;

export default async function MortalidadePage() {
  const [mortalidadeTotalRes, mortalidadeMunicipiosRes, mortalidadeUFRes] =
    await Promise.all([
      supabase.from("tx_mortalidade_ccu").select("*").ilike("municipio", "%total%"),
      supabase.from("tx_mortalidade_ccu").select("*").not("municipio", "ilike", "%total%"),
      supabase.from("tx_mortalidade_ccu_uf").select("*"),
    ]);

  const erro =
    mortalidadeTotalRes.error ||
    mortalidadeMunicipiosRes.error ||
    mortalidadeUFRes.error;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r mb-6 shadow-sm">
          <p className="font-bold">Erro ao carregar dados do Supabase</p>
          <p className="text-sm">{erro.message}</p>
        </div>
      )}

      <DashboardMortalidade
        mortalidadeCCU={mortalidadeTotalRes.data || []}
        mortalidadeMunicipios={mortalidadeMunicipiosRes.data || []}
        mortalidadeUF={mortalidadeUFRes.data || []}
      />
    </main>
  );
}