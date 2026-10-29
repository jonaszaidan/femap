"use client";

import React from "react";

interface IconeFemMapProps {
  className?: string;
}

export default function IconeFemMap({ className = "w-20 h-20" }: IconeFemMapProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contorno sutil do Mapa do Brasil (Verde-água/Turquesa) */}
      <path 
        d="M25 15 C45 8, 65 12, 75 22 C88 34, 92 50, 85 70 C78 88, 60 98, 42 94 C25 90, 10 70, 18 45 C20 35, 12 20, 25 15 Z" 
        className="stroke-teal-400"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(20, 184, 166, 0.02)"
      />
      {/* Útero e Trompas Integrados (Rosa Suave) */}
      <path 
        d="M30 35 C30 25, 42 22, 50 32 C58 22, 70 25, 70 35 C74 45, 65 58, 58 62 L58 78 C58 83, 42 83, 42 78 L42 62 C35 58, 26 45, 30 35 Z" 
        className="fill-pink-50 stroke-pink-500"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Detalhes internos orgânicos (Cinza claro/Lilás sutil) */}
      <circle cx="36" cy="48" r="3" className="fill-slate-400" />
      <circle cx="64" cy="48" r="3" className="fill-slate-400" />
      <path d="M48 40 C48 40, 52 40, 52 40" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}