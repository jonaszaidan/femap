"use client";

interface KpiPapSmearProps {
  taxaSisab?: string;
  taxaCalculada?: string;
  populacaoAlvo?: string;
  totalExames?: string;
}

export default function Kpi_Pap_Smear({
  taxaSisab = "35%",
  taxaCalculada = "60%",
  populacaoAlvo = "8.000",
  totalExames = "5.000",
}: KpiPapSmearProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-xl shadow-sm text-center flex flex-col justify-center border border-slate-100">
        <span className="text-sm font-bold text-slate-700 mb-2 leading-tight">
          Taxa de cobertura SISAB
        </span>
        <span className="text-3xl font-extrabold text-slate-900">
          {taxaSisab}
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-center flex flex-col justify-center border border-slate-100">
        <span className="text-sm font-bold text-slate-700 mb-2 leading-tight">
          Taxa de cobertura calculada
        </span>
        <span className="text-3xl font-extrabold text-slate-900">
          {taxaCalculada}
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-center flex flex-col justify-center border border-slate-100">
        <span className="text-sm font-bold text-slate-700 mb-2 leading-tight">
          População alvo total
        </span>
        <span className="text-3xl font-extrabold text-slate-900">
          {populacaoAlvo}
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-center flex flex-col justify-center border border-slate-100">
        <span className="text-sm font-bold text-slate-700 mb-2 leading-tight">
          Total de exames
        </span>
        <span className="text-3xl font-extrabold text-slate-900">
          {totalExames}
        </span>
      </div>
    </div>
  );
}