import { supabase } from "../../lib/supabase";

/**
 * Consulta a evolução histórica dos números ABSOLUTOS de HSIL, Mortalidade e Incidência por ano.
 * Traz todos os anos disponíveis para o Brasil.
 * 
 * @param {string} estado - Referência geográfica (Padrão: 'Total_UF')
 */
export async function getEvolucaoMortalidadeHSIL(estado = "Total_UF") {
  const ehTotal = !estado || estado === "Total" || estado === "Total_UF" || estado === "Brasil";
  const filtrosEstado = ehTotal ? ["Total_UF", "Total", "Brasil"] : [estado];

  try {
    // Busca dados nas três tabelas em paralelo
    const [resHsil, resMortalidade, resIncidencia] = await Promise.all([
      supabase
        .from("hsil_uf")
        .select("ano, lesao")
        .in("estado", filtrosEstado)
        .order("ano", { ascending: true }),

      supabase
        .from("tx_mortalidade_ccu_uf")
        .select("ano, ab_mortalidade_ccu")
        .in("estado", filtrosEstado)
        .order("ano", { ascending: true }),

      // incidencia_uf não tem linha de total: para o Brasil traz todas as UFs
      // (soma feita abaixo); para um estado específico filtra pelo nome.
      ehTotal
        ? supabase
            .from("incidencia_uf")
            .select("ano, incidencia")
            .order("ano", { ascending: true })
        : supabase
            .from("incidencia_uf")
            .select("ano, incidencia")
            .eq("estado", estado)
            .order("ano", { ascending: true }),
    ]);

    if (resHsil.error) console.error("Erro em hsil_uf:", resHsil.error);
    if (resMortalidade.error) console.error("Erro em ab_mortalidade_ccu_uf:", resMortalidade.error);
    if (resIncidencia.error) console.error("Erro em incidencia_uf:", resIncidencia.error);

    const dataHsil = resHsil.data || [];
    const dataMortalidade = resMortalidade.data || [];
    const dataIncidencia = resIncidencia.data || [];

    const mapaPorAno = {};

    const garantirAno = (anoNum) => {
      if (!mapaPorAno[anoNum]) {
        mapaPorAno[anoNum] = {
          ano: anoNum,
          lesao: 0,
          ab_mortalidade_ccu: 0,
          incidencia: 0,
          hsil: 0,
          mortalidade: 0,
        };
      }
      return mapaPorAno[anoNum];
    };

    // 1. Processa dados de HSIL
    dataHsil.forEach((item) => {
      const registro = garantirAno(Number(item.ano));
      const valor = item.lesao ? Number(item.lesao) : 0;
      registro.lesao = valor;
      registro.hsil = valor;
    });

    // 2. Processa dados de Mortalidade
    dataMortalidade.forEach((item) => {
      const registro = garantirAno(Number(item.ano));
      const valor = item.ab_mortalidade_ccu ? Number(item.ab_mortalidade_ccu) : 0;
      registro.ab_mortalidade_ccu = valor;
      registro.mortalidade = valor;
    });

    // 3. Processa dados de Incidência (soma das UFs por ano)
    dataIncidencia.forEach((item) => {
      const registro = garantirAno(Number(item.ano));
      registro.incidencia += item.incidencia ? Number(item.incidencia) : 0;
    });

    return Object.values(mapaPorAno).sort((a, b) => a.ano - b.ano);
  } catch (error) {
    console.error("Erro ao carregar consulta de evolução de absolutos:", error);
    return [];
  }
}