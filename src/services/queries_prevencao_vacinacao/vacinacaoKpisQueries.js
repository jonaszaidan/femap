import { supabase } from '../../lib/supabase';

/**
 * Consulta e calcula os KPIs consolidados de Vacinação contra o HPV para o Brasil
 * com base no ano selecionado, no filtro de sexo e filtrando por '9 a 14 Anos'.
 */
export async function getKpisVacinacao(ano, sexo = 'geral') {
  let query = supabase
    .from('vacinacao_uf')
    .select('doses, populacao, sexo, ano_cobertura')
    .eq('ano', Number(ano))
    .eq('ano_cobertura', '9 a 14 Anos');

  // Se o sexo for específico ('Feminino' ou 'Masculino'), aplica o filtro na query
  if (sexo && sexo !== 'geral') {
    const sexoFormatado = sexo.charAt(0).toUpperCase() + sexo.slice(1);
    query = query.eq('sexo', sexoFormatado);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar KPIs de vacinação:', error);
    return { totalDoses: 0, totalPopulacao: 0, taxaCobertura: 0 };
  }

  if (data && data.length > 0) {
    // Como a tabela possui as linhas divididas por estado e sexo, 
    // somamos as doses e a população de todos os registros retornados.
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