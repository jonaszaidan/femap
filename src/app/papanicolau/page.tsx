import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardPapanicolau from "../../components/Dashboard_PapaNicolau";

export const revalidate = 0;

export default async function PapanicolauPage() {
  // Consultando a tabela de UFs que efetivamente existe no Supabase
  const coletaUFRes = await supabase
    .from("coleta_papa_nicolau_uf")
    .select("*")
    .neq("estado", "Total_UF");

  const erro = coletaUFRes.error;

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

      <DashboardPapanicolau
           coletaUF={coletaUFRes.data || []}
      />
    </main>
  );
}