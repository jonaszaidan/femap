//PAGE MAPA DE PRIORIDADE

import Header from "../../components/Header";
import NavTabs from "../../components/NavTabs";
import DashboardMapaPrioridade from "../../components/Dashboard_MapaPrioridade";



export default function MapaPrioridadePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <Header />
      <NavTabs />

      <DashboardMapaPrioridade />
    </main>
  );
}