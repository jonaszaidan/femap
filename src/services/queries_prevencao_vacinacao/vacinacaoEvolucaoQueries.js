import { supabase } from '../../lib/supabase';

/**
 * Consulta a evolução temporal da taxa de cobertura de vacinação contra o HPV no Brasil (9 a 14 anos)
 * agrupando por ano, respeitando o filtro de sexo e calculando ((soma_doses / soma_populacao) * 100).
 */
export async function getEvolucaoVacinacaoBrasil(sexo = 'geral') {
  let query = supabase
    .from('vacinacao_uf')
    .select('ano, sexo, doses, populacao')
    .eq('ano_cobertura', '9 a 14 Anos');

  // Aplica o filtro de sexo se for diferente de 'geral'
  if (sexo && sexo !== 'geral') {
    const sexoFormatado = sexo.charAt(0).toUpperCase() + sexo.slice(1);
    query = query.eq('sexo', sexoFormatado);
  }

  const { data, error } = await query;

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
        taxa: Number(taxa.toFixed(1)),
      };
    });
  }

  return [];
}