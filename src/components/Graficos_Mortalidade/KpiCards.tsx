"use client";

interface PiorEstado {
  estado: string;
  taxa: number | string;
}

interface KpiCardsProps {
  // Mortalidade
  taxaMortalidadeCCU: string | number;
  totalObitos: string | number;
  piorEstadoMortalidade: PiorEstado | null;

  // HSIL
  taxaHsil: string | number;
  totalResultadosHsil: string | number;
  piorEstadoHsil: PiorEstado | null;
}

// Função para formatar valores como inteiros com separador de milhar (ex: 385.00 -> 385 | 7630134 -> 7.630.134)
const formatarInteiro = (valor: number | string) => {
  const numero = Number(valor) || 0;
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(numero);
};

export default function KpiCards({ 
  taxaMortalidadeCCU, 
  totalObitos, 
  piorEstadoMortalidade,
  taxaHsil,
  totalResultadosHsil,
  piorEstadoHsil
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* 1. KPI Mortalidade (Dinâmico) */}
      <div className="bg-[#67001f]/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center text-gray-900 border border-[#67001f]/20">
        <h2 className="text-xl font-extrabold mb-4">Mortalidade</h2>
        <div className="grid grid-cols-3 gap-2 w-full items-end">
          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              {taxaMortalidadeCCU}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              a cada 100 mil mulheres
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              {formatarInteiro(totalObitos)}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              mortes
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base xl:text-lg font-extrabold uppercase leading-tight">
              {piorEstadoMortalidade?.estado || "N/A"}
            </p>
            <p className="text-[10px] font-bold text-gray-900 mt-1 leading-tight">
              Estado com maior taxa de mortalidade
            </p>
            <p className="text-[10px] text-gray-700 font-medium mt-1 leading-tight">
              {piorEstadoMortalidade?.taxa || 0} /100 mil mulheres
            </p>
          </div>
        </div>
      </div>

      {/* 2. Incidência */}
      <div className="bg-orange-100/70 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center text-gray-900">
        <h2 className="text-xl font-extrabold mb-4">Incidência</h2>
        <div className="grid grid-cols-3 gap-2 w-full items-end">
          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              17
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              a cada 100 mil mulheres
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              17.000
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              casos
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base xl:text-lg font-extrabold leading-tight">
              Pará
            </p>
            <p className="text-[10px] font-bold text-gray-900 mt-1 leading-tight">
              Estado com maior taxa de incidência
            </p>
            <p className="text-[10px] text-gray-700 font-medium mt-1 leading-tight">
              24.5 /100 mil mulheres
            </p>
          </div>
        </div>
      </div>

      {/* 3. KPI HSIL (Dinâmico) */}
      <div className="bg-green-100/70 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center text-gray-900">
        <h2 className="text-xl font-extrabold mb-4">HSIL</h2>
        <div className="grid grid-cols-3 gap-2 w-full items-end">
          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              {formatarInteiro(taxaHsil)}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              Lesões a cada 100 mil exames
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              {formatarInteiro(totalResultadosHsil)}
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              Exames satisfatórios
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base xl:text-lg font-extrabold uppercase leading-tight">
              {piorEstadoHsil?.estado || "N/A"}
            </p>
            <p className="text-[10px] font-bold text-gray-900 mt-1 leading-tight">
              Estado com maior percentual de HSIL
            </p>
            <p className="text-[10px] text-gray-700 font-medium mt-1 leading-tight">
              {piorEstadoHsil?.taxa ? formatarInteiro(piorEstadoHsil.taxa) : 0} /100 mil exames
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}