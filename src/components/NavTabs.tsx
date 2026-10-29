"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const abas = [
    { id: "mortalidade", label: "Mortalidade", path: "/mortalidade" },
    { id: "vacinacao", label: "Prevenção / Vacinação", path: "/prevencao" },
    { id: "papanicolau", label: "Papanicolau", path: "/papanicolau" },
    { id: "prioridades", label: "Mapa de Prioridades", path: "/mapaprioridade" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {abas.map((aba) => {
        // Verifica se a rota atual corresponde à aba
        const estaAtiva = pathname?.includes(aba.path);

        return (
          <button
            key={aba.id}
            onClick={() => router.push(aba.path)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer ${
              estaAtiva
                ? "bg-[#8B9BB4] text-white shadow"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {aba.label}
          </button>
        );
      })}
    </div>
  );
}