import { supabase } from '../../lib/supabase';

/**
 * Consulta os 10 estados com as maiores taxas de HSIL em um determinado ano,
 * excluindo a linha de totalização nacional (Total_UF).
 */
export async function getTop10Hsil(ano) {
  const { data, error } = await supabase
    .from('hsil_uf')
    .select('uf, estado, ano, tx_hsil_uf, lesao, exames')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF') // Ignora o total do Brasil
    .order('tx_hsil_uf', { ascending: false }) // Do menor para o maior (piores taxas)
    .limit(10);

  if (error) {
    console.error('Erro ao buscar Top 10 HSIL:', error);
    return [];
  }

  return data || [];
}