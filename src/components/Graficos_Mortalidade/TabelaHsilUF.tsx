"use client";

interface HsilItem {
  municipio?: string;
  estado?: string;
  uf?: string;
  tx_hsil_uf?: number;

  [key: string]: any;
}

interface TabelaTop10HsilProps {
  titulo: string;
  dados: HsilItem[];
  corTextoTaxa?: string; // Ex: 'text-emerald-600'
}

export default function TabelaTop10Hsil({
  titulo,
  dados,
  corTextoTaxa = "text-emerald-600",
}: TabelaTop10HsilProps) {
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
              <th className="text-left py-2">Estado / Local</th>
              <th className="text-right py-2">Taxa (por 100 mil)</th>
            </tr>
          </thead>
          <tbody>
            {dados.slice(0, 10).map((item, index) => {
              // Suporta tanto tx_hsil_uf quanto propriedade genérica de taxa
              const valorTaxa = Number(item.tx_hsil_uf ?? item.taxa ?? 0);
              const nomeLocal = item.estado ?? item.municipio ?? item.uf ?? "N/A";

              return (
                <tr
                  key={`${nomeLocal}-${index}`}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-2.5 text-slate-500 font-medium">#{index + 1}</td>
                  <td className="py-2.5 font-medium text-slate-700">{nomeLocal}</td>
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