"use client";

interface KpiCardsProps {
  taxaMortalidadeCCU: string;
}

export default function KpiCards({ taxaMortalidadeCCU }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* KPI Mortalidade */}
      <div className="bg-pink-100/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center text-gray-900">
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
              6.008
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              mortes
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base xl:text-lg font-extrabold uppercase leading-tight">
              AMAZONAS
            </p>
            <p className="text-[10px] font-bold text-gray-900 mt-1 leading-tight">
              Estado com maior taxa de mortalidade
            </p>
            <p className="text-[10px] text-gray-700 font-medium mt-1 leading-tight">
              13.9 /100 mil mulheres
            </p>
          </div>
        </div>
      </div>

      {/* Card 1: Incidência */}
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

      {/* Card 2: HSIL */}
      <div className="bg-green-100/70 rounded-3xl p-5 shadow-sm flex flex-col justify-between text-center text-gray-900">
        <h2 className="text-xl font-extrabold mb-4">HSIL</h2>
        <div className="grid grid-cols-3 gap-2 w-full items-end">
          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              20
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              Resultados a cada 100 mil exames
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl xl:text-3xl font-extrabold leading-none">
              6.008
            </p>
            <p className="text-[11px] font-semibold text-gray-700 mt-2 leading-tight">
              Resultados
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-base xl:text-lg font-extrabold uppercase leading-tight">
              AMAZONAS
            </p>
            <p className="text-[10px] font-bold text-gray-900 mt-1 leading-tight">
              Estado com maior percentual de HSIL
            </p>
            <p className="text-[10px] text-gray-700 font-medium mt-1 leading-tight">
              25 /100 mil exames
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}