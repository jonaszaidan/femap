export default function Header() {
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  return (
    <header className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            FeMap
          </h1>

          <p className="text-slate-500 mt-1">
            Plataforma Inteligente de Saúde da Mulher
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            Última atualização
          </p>

          <p className="font-semibold">
            {dataAtual}
          </p>
        </div>

      </div>
    </header>
  );
}