

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white rounded-2xl px-6 py-4 mt-auto shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
      
      {/* Esquerda: Nome da Marca */}
      <div className="font-bold text-slate-800 tracking-tight">
        Fem<span className="text-pink-600">Map</span> — Plataforma Inteligente de Saúde da Mulher
      </div>

      {/* Direita: Desenvolvido por com os Links do LinkedIn */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 font-medium text-slate-500">
        <span> © 2026 FemMap | Desenvolvido por</span>
        
        {/* Link da Gisele */}
        <a 
          href="https://www.linkedin.com/in/giselle-rezende-86254617b/" // Substitua pelo link correto da Gisele
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-700 hover:text-pink-600 font-semibold transition-colors inline-flex items-center gap-1"
        >
          Giselle A. S. Rezende
          {/* Ícone do LinkedIn */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        </a>

        <span>&</span>

        {/* Link do Jonas */}
        <a 
          href="https://www.linkedin.com/in/jonas-zaidan" // Substitua pelo link correto do Jonas
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-700 hover:text-pink-600 font-semibold transition-colors inline-flex items-center gap-1"
        >
          Jonas Zaidan Gaspar
          {/* Ícone do LinkedIn */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        </a>

      </div>

    </footer>
  );
}