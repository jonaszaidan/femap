//PAGE Mortalidade
import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardMortalidade from "../../components/Dashboard_Mortalidade_CCU";

export const revalidate = 0;

export default function MortalidadePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      <DashboardMortalidade />
    </main>
  );
}