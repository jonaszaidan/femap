import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardVacinacao from "../../components/Dashboard_Prevencao_Vacinacao";

export default async function PrevencaoPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      <DashboardVacinacao />
    </main>
  );
}