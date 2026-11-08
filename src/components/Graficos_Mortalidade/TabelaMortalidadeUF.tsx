"use client";

interface EstadoItem {
  estado?: string;
  uf?: string;
  tx_mortalidade?: number;
  tx_mortalidade_ccu?: number;
  taxa?: number;
  [key: string]: any;
}

interface TabelaTop10Props {
  titulo: string;
  dados: EstadoItem[];
  corTextoTaxa?: string; // cor CSS (ex: "rgb(81, 3, 26)" ou "#0B7A75")
}

const COR_PADRAO_TAXA = "#0B7A75"; // verde -petrolio

export default function TabelaTop10Estados({
  titulo,
  dados,
  corTextoTaxa = COR_PADRAO_TAXA,
}: TabelaTop10Props) {
  const listaDados = Array.isArray(dados) ? dados : [];

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
              <th className="text-left py-2">Estado</th>
              <th className="text-right py-2">Taxa (por 100 mil)</th>
            </tr>
          </thead>
          <tbody>
            {listaDados.slice(0, 10).map((item, index) => {
              const valorTaxa = Number(
                item.tx_mortalidade ??
                  item.tx_mortalidade_ccu ??
                  item.taxa ??
                  0
              );
              const nomeEstado = item.estado ?? item.uf ?? "N/A";

              return (
                <tr
                  key={`${nomeEstado}-${index}`}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-2.5 text-slate-500 font-medium">
                    #{index + 1}
                  </td>
                  <td className="py-2.5 font-medium text-slate-700">
                    {nomeEstado}
                  </td>
                  <td
                    className="py-2.5 text-right font-bold"
                    style={{ color: corTextoTaxa }}
                  >
                    {valorTaxa.toFixed(2)}
                  </td>
                </tr>
              );
            })}
            {listaDados.length === 0 && (
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