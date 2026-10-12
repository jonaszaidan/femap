import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardMapaPrioridade from "../../components/Dashboard_MapaPrioridade";

export const revalidate = 0;

export default async function MapaPrioridadePage() {
  const [mortalidadeRes, municipiosRes] = await Promise.all([
    supabase
      .from("tx_mortalidade_ccu")
      .select('municipio, ano, "tx.mortalidade", codigo_ibge'),
    supabase
      .from("municipios")
      .select("codigo_ibge, nome, latitude, longitude"),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      <DashboardMapaPrioridade
        dadosMortalidade={mortalidadeRes.data || []}
        dadosMunicipios={municipiosRes.data || []}
      />
    </main>
  );
}