"use client";

interface KpiPapSmearProps {
  taxaSisab?: string;
  taxaCalculada?: string;
  populacaoAlvo?: string;
  totalExames?: string;
}

// Paleta amarelo/dourado (Rastreamento)
const COR_FUNDO = "#F5D77F"; // 3º tom da paleta
const COR_TEXTO = "#0f172a"; // texto principal (slate-900)
const COR_TITULO = "#1e293b"; // títulos dos cards (slate-800)

export default function Kpis_PapaNicolau({
  taxaSisab = "0%",
  taxaCalculada = "0%",
  populacaoAlvo = "0",
  totalExames = "0",
}: KpiPapSmearProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Card 1: Taxa de Cobertura SISAB */}
      <div
        className="p-5 rounded-xl shadow-sm text-center flex flex-col justify-center"
        style={{ backgroundColor: COR_FUNDO }}
      >
        <span
          className="text-sm font-bold mb-2 leading-tight"
          style={{ color: COR_TITULO }}
        >
          Taxa de cobertura SISAB
        </span>
        <span className="text-3xl font-extrabold" style={{ color: COR_TEXTO }}>
          {taxaSisab}
        </span>
      </div>

      {/* Card 2: Taxa de Cobertura Calculada */}
      <div
        className="p-5 rounded-xl shadow-sm text-center flex flex-col justify-center"
        style={{ backgroundColor: COR_FUNDO }}
      >
        <span
          className="text-sm font-bold mb-2 leading-tight"
          style={{ color: COR_TITULO }}
        >
          Taxa de cobertura calculada
        </span>
        <span className="text-3xl font-extrabold" style={{ color: COR_TEXTO }}>
          {taxaCalculada}
        </span>
      </div>

      {/* Card 3: População Alvo Total */}
      <div
        className="p-5 rounded-xl shadow-sm text-center flex flex-col justify-center"
        style={{ backgroundColor: COR_FUNDO }}
      >
        <span
          className="text-sm font-bold mb-2 leading-tight"
          style={{ color: COR_TITULO }}
        >
          População alvo total
        </span>
        <span className="text-3xl font-extrabold" style={{ color: COR_TEXTO }}>
          {populacaoAlvo}
        </span>
      </div>

      {/* Card 4: Total de Exames */}
      <div
        className="p-5 rounded-xl shadow-sm text-center flex flex-col justify-center"
        style={{ backgroundColor: COR_FUNDO }}
      >
        <span
          className="text-sm font-bold mb-2 leading-tight"
          style={{ color: COR_TITULO }}
        >
          Total de exames
        </span>
        <span className="text-3xl font-extrabold" style={{ color: COR_TEXTO }}>
          {totalExames}
        </span>
      </div>
    </div>
  );
}