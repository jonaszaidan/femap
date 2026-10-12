import { supabase } from '../../lib/supabase';

/**
 * Consulta o Top 10 estados/registros com maior taxa de mortalidade para um determinado ano,
 * trazendo também o valor absoluto.
 * @param {number|string} ano
 */
export async function getTop10Mortalidade(ano) {
  const { data, error } = await supabase
    .from('tx_mortalidade_ccu_uf')
    .select('estado, uf, ano, tx_mortalidade_ccu, ab_mortalidade_ccu')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF') // Ignora o total do Brasil
    .order('tx_mortalidade_ccu', { ascending: false }) // Do maior para o menor (piores taxas)
    .limit(10);

  if (error) {
    console.error('Erro ao buscar o top 10 de mortalidade:', error);
    return [];
  }

  return data || [];
}