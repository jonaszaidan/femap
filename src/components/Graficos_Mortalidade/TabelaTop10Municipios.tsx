"use client";

interface MunicípioItem {
  municipio: string;
  tx_mortalidade?: number;
  taxa?: number;
  [key: string]: any;
}

interface TabelaTop10Props {
  titulo: string;
  dados: MunicípioItem[];
  corTextoTaxa?: string; // Ex: 'text-red-600', 'text-orange-600', 'text-emerald-600'
}

export default function TabelaTop10Municipios({
  titulo,
  dados,
  corTextoTaxa = "text-red-600",
}: TabelaTop10Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 leading-snug">
        {titulo}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="text-left py-2">Ranking</th>
              <th className="text-left py-2">Município</th>
              <th className="text-right py-2">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {dados.slice(0, 10).map((item, index) => {
              const valorTaxa = Number(item.tx_mortalidade ?? item.taxa ?? 0);
              return (
                <tr
                  key={`${item.municipio}-${index}`}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-2.5 text-slate-500 font-medium">#{index + 1}</td>
                  <td className="py-2.5 font-medium text-slate-700">{item.municipio}</td>
                  <td className={`py-2.5 text-right font-bold ${corTextoTaxa}`}>
                    {valorTaxa.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {dados.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-slate-400">
                  Nenhum dado encontrado para o ano selecionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}