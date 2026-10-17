import { supabase } from "../../lib/supabase";

/**
 * Consulta a evolução histórica dos números ABSOLUTOS de HSIL e Mortalidade por ano.
 * Traz todos os anos disponíveis para o Brasil.
 * 
 * @param {string} estado - Referência geográfica (Padrão: 'Total_UF')
 */
export async function getEvolucaoMortalidadeHSIL(estado = "Total_UF") {
  const ehTotal = !estado || estado === "Total" || estado === "Total_UF" || estado === "Brasil";
  const filtrosEstado = ehTotal ? ["Total_UF", "Total", "Brasil"] : [estado];

  try {
    // Busca dados nas duas tabelas em paralelo com filtro flexível no campo 'estado'
    const [resHsil, resMortalidade] = await Promise.all([
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
    ]);

    if (resHsil.error) console.error("Erro em hsil_uf:", resHsil.error);
    if (resMortalidade.error) console.error("Erro em ab_mortalidade_ccu_uf:", resMortalidade.error);

    const dataHsil = resHsil.data || [];
    const dataMortalidade = resMortalidade.data || [];

    const mapaPorAno = {};

    // 1. Processa dados de HSIL
    dataHsil.forEach((item) => {
      const anoNum = Number(item.ano);
      if (!mapaPorAno[anoNum]) {
        mapaPorAno[anoNum] = { ano: anoNum, lesao: 0, ab_mortalidade_ccu: 0, hsil: 0, mortalidade: 0 };
      }
      const valor = item.lesao ? Number(item.lesao) : 0;
      mapaPorAno[anoNum].lesao = valor;
      mapaPorAno[anoNum].hsil = valor;
    });

    // 2. Processa dados de Mortalidade
    dataMortalidade.forEach((item) => {
      const anoNum = Number(item.ano);
      if (!mapaPorAno[anoNum]) {
        mapaPorAno[anoNum] = { ano: anoNum, lesao: 0, ab_mortalidade_ccu: 0, hsil: 0, mortalidade: 0 };
      }
      const valor = item.ab_mortalidade_ccu ? Number(item.ab_mortalidade_ccu) : 0;
      mapaPorAno[anoNum].ab_mortalidade_ccu = valor;
      mapaPorAno[anoNum].mortalidade = valor;
    });

    return Object.values(mapaPorAno).sort((a, b) => a.ano - b.ano);
  } catch (error) {
    console.error("Erro ao carregar consulta de evolução de absolutos:", error);
    return [];
  }
}