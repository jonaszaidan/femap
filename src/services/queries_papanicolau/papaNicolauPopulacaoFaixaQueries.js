import { supabase } from '../../lib/supabase';

/**
 * Consulta a população alvo agrupada por faixa etária para o gráfico.
 */
export async function getPopulacaoAlvoPorFaixaEtaria(estado = 'Brasil') {
  let query = supabase
    .from('populacao_alvo_uf')
    .select('idade, pessoas')
    .eq('estado', estado);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar população alvo por faixa etária:', error);
    return [];
  }

  if (data && data.length > 0) {
    // Mapeia os dados garantindo a conversão do campo 'pessoas' para número
    return data.map((item) => ({
      faixa_etaria: item.idade,
      total_pessoas: Number(item.pessoas || 0),
    }));
  }

  return [];
}