import { supabase } from '../../lib/supabase';

/**
 * Consulta e calcula os KPIs consolidados de Vacinação contra o HPV para o Brasil
 * com base no ano selecionado e filtrando por '9 a 14 Anos'.
 */
export async function getKpisVacinacao(ano) {
  const { data, error } = await supabase
    .from('vacinacao_uf')
    .select('doses, populacao')
    .eq('ano', Number(ano))
    .eq('ano_cobertura', '9 a 14 Anos');

  if (error) {
    console.error('Erro ao buscar KPIs de vacinação:', error);
    return { totalDoses: 0, totalPopulacao: 0, taxaCobertura: 0 };
  }

  if (data && data.length > 0) {
    const totalDoses = data.reduce((acc, curr) => acc + (Number(curr.doses) || 0), 0);
    const totalPopulacao = data.reduce((acc, curr) => acc + (Number(curr.populacao) || 0), 0);
    const taxaCobertura = totalPopulacao > 0 ? (totalDoses / totalPopulacao) * 100 : 0;

    return {
      totalDoses,
      totalPopulacao,
      taxaCobertura,
    };
  }

  return { totalDoses: 0, totalPopulacao: 0, taxaCobertura: 0 };
}