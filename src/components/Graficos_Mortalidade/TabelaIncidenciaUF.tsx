"use client";

interface ItemIncidenciaUF {
  uf: string;
  estado?: string;
  incidencia?: number;
}

interface Props {
  titulo: string;
  dados: ItemIncidenciaUF[];
  corTextoTaxa?: string;
}

export default function TabelaIncidenciaUF({
  titulo,
  dados = [],
  corTextoTaxa = "#85264F",
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{titulo}</h3>

      <div className="grid grid-cols-[56px_1fr_auto] gap-x-3 pb-2 border-b border-slate-200 text-xs font-semibold text-slate-400">
        <span>Ranking</span>
        <span>Estado</span>
        <span className="text-right">Casos</span>
      </div>

      {dados.length === 0 ? (
        <p className="py-6 text-sm text-slate-400 text-center">Sem dados para o período.</p>
      ) : (
        <ul>
          {dados.map((item, index) => (
            <li
              key={`${item.uf}-${index}`}
              className="grid grid-cols-[56px_1fr_auto] gap-x-3 items-center py-3 border-b border-slate-100 last:border-b-0 text-sm"
            >
              <span className="text-slate-400 font-semibold">#{index + 1}</span>
              <span className="text-slate-700">{item.estado || item.uf}</span>
              <span className="text-right font-bold" style={{ color: corTextoTaxa }}>
                {Number(item.incidencia || 0).toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}