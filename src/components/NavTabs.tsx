"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Mortalidade", href: "/mortalidade" },
    { name: "Prevenção / Vacinação", href: "/prevencao" },
    { name: "Papanicolau", href: "/papanicolau" }, // <--- Adicionado aqui
    { name: "Mapa de Prioridades", href: "/mapaprioridade" }, // Ajuste conforme a sua rota real
  ];

  return (
    <div className="flex gap-4 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              isActive
                ? "bg-pink-600 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}