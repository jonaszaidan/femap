import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardPapSmear from "../../components/Dashboard_PapaNicolau";

export const revalidate = 0;

export default async function PrevencaoPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      <DashboardPapSmear />
    </main>
  );
}