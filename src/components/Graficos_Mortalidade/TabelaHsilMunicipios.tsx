"use client";

export interface HsilMunicipioTabelaItem {
  municipio: string;
  codigo_ibge?: string | number;
  tx_hsil_municipio?: number;
}

interface Props {
  titulo: string;
  dados?: HsilMunicipioTabelaItem[];
  corTextoTaxa?: string;
}

export default function TabelaHsilMunicipios({
  titulo,
  dados = [],
  corTextoTaxa = "text-emerald-600",
}: Props) {
  const listaDados = Array.isArray(dados) ? dados : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <h3 className="text-md font-bold text-slate-800 mb-4">{titulo}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-slate-400 font-semibold">
              <th className="pb-2 w-16">Ranking</th>
              <th className="pb-2">Município</th>
              <th className="pb-2 text-right">Taxa HSIL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {listaDados.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-slate-400 text-xs">
                  Nenhum dado encontrado
                </td>
              </tr>
            ) : (
              listaDados.slice(0, 10).map((item, index) => {
                const valorTaxa = item.tx_hsil_municipio ?? 0;
                return (
                  <tr key={`${item.codigo_ibge}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-400">#{index + 1}</td>
                    <td className="py-2.5 font-medium text-slate-700">{item.municipio}</td>
                    <td className={`py-2.5 font-bold text-right ${corTextoTaxa}`}>
                      {Number(valorTaxa).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}