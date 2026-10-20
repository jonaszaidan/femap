import { supabase } from '../../lib/supabase';

/**
 * Consulta a evolução temporal da taxa de cobertura de vacinação contra o HPV no Brasil (9 a 14 anos)
 * agrupando por ano e calculando ((soma_doses / soma_populacao) * 100).
 */
export async function getEvolucaoVacinacaoBrasil() {
  const { data, error } = await supabase
    .from('vacinacao_uf')
    .select('ano, doses, populacao')
    .eq('ano_cobertura', '9 a 14 Anos');

  if (error) {
    console.error('Erro ao buscar evolução temporal da vacinação:', error);
    return [];
  }

  if (data && data.length > 0) {
    const agrupadoPorAno = {};

    data.forEach((item) => {
      const anoNum = Number(item.ano);
      if (!anoNum) return;

      if (!agrupadoPorAno[anoNum]) {
        agrupadoPorAno[anoNum] = { doses: 0, populacao: 0 };
      }

      agrupadoPorAno[anoNum].doses += Number(item.doses || 0);
      agrupadoPorAno[anoNum].populacao += Number(item.populacao || 0);
    });

    const anosOrdenados = Object.keys(agrupadoPorAno)
      .map(Number)
      .sort((a, b) => a - b);

    return anosOrdenados.map((ano) => {
      const { doses, populacao } = agrupadoPorAno[ano];
      const taxa = populacao > 0 ? (doses / populacao) * 100 : 0;

      return {
        ano: String(ano),
        taxa: Number(taxa.toFixed(1)), // Retorna ex: 71.1
      };
    });
  }

  return [];
}