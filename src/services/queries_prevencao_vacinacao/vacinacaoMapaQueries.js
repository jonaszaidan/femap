import { supabase } from '../../lib/supabase';

/**
 * Consulta os dados de taxa de vacinação contra HPV por UF para um determinado ano,
 * considerando a faixa etária total de '9 a 14 Anos'.
 */
export async function getVacinacaoPorEstado(ano) {
  const { data, error } = await supabase
    .from('vacinacao_uf')
    .select('id, uf, estado, sexo, ano_cobertura, doses, populacao, ano, tx_vacinacao_uf')
    .eq('ano', Number(ano))
    .eq('ano_cobertura', '9 a 14 Anos');

  if (error) {
    console.error('Erro ao buscar dados de vacinação por estado:', error);
    return [];
  }

  if (data && data.length > 0) {
    return data.map((item) => ({
      id: item.id,
      uf: item.uf,
      estado: item.estado,
      sexo: item.sexo,
      ano_cobertura: item.ano_cobertura,
      doses: item.doses != null ? Number(item.doses) : 0,
      populacao: item.populacao != null ? Number(item.populacao) : 0,
      ano: Number(item.ano),
      tx_vacinacao_uf: item.tx_vacinacao_uf != null ? Number(item.tx_vacinacao_uf) : 0,
    }));
  }

  return [];
}