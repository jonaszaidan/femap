import { supabase } from "../src/lib/supabase";

export default async function Home() {
  const { data: indicadores, error } = await supabase
    .from("indicadores")
    .select("*");

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-6">
        FeMap
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Municípios
          </h2>

          <p className="text-3xl font-bold">
            {indicadores?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Média Vacinação HPV
          </h2>

          <p className="text-3xl font-bold text-green-600">
            {Math.round(
              (indicadores?.reduce(
                (acc, item) => acc + Number(item.vacinacao_hpv),
                0
              ) || 0) / (indicadores?.length || 1)
            )}
            %
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-500">
            Média Mortalidade
          </h2>

          <p className="text-3xl font-bold text-red-600">
            {(
              (indicadores?.reduce(
                (acc, item) => acc + Number(item.mortalidade),
                0
              ) || 0) / (indicadores?.length || 1)
            ).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">
          Indicadores Municipais
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Município</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Mortalidade</th>
              <th className="text-left p-2">HPV (%)</th>
              <th className="text-left p-2">Rastreamento (%)</th>
            </tr>
          </thead>

          <tbody>
            {indicadores?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.municipio}</td>
                <td className="p-2">{item.estado}</td>
                <td className="p-2">{item.mortalidade}</td>
                <td className="p-2">{item.vacinacao_hpv}</td>
                <td className="p-2">{item.rastreamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}