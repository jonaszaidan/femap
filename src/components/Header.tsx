"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logoFemMap from "@/public/imagens/logo-femmap.jpg";

export default function Header() {
  const dataAtualizacao = "29/10/2026";

  return (
    <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-slate-100 flex flex-wrap justify-between items-center gap-4">
      
      {/* Bloco do Logo e Título (Esquerda) */}
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0 w-28 h-28 relative flex items-center justify-center">
          <Image 
            src={logoFemMap}
            alt="Logo FemMap"
            width={112}
            height={112}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-slate-950 leading-none tracking-tight">
            Fem<span className="text-pink-600">Map</span>
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-3">
            Plataforma Inteligente de Saúde da Mulher
          </p>
        </div>
      </div>

      {/* Restante do Header (Links e Data) */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-2">
          <Link 
            href="/sobre" 
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 rounded-xl transition-all"
          >
            Sobre
          </Link>
          <Link 
            href="/contato" 
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 rounded-xl transition-all"
          >
            Contato
          </Link>
        </nav>

        <div className="text-right flex flex-col items-end gap-0.5 px-2 py-1">
          <span className="text-xs font-semibold text-slate-400">
            Última atualização
          </span>
          <span className="text-sm font-bold text-slate-800 tracking-tight">
            {dataAtualizacao}
          </span>
        </div>
      </div>

    </div>
  );
}