import { supabase } from '../../lib/supabase';

/**
 * Consulta a taxa de HSIL e dados por UF para um determinado ano,
 * excluindo a linha de totalização nacional (Total_UF).
 */
export async function getHsilPorEstado(ano) {
  const { data, error } = await supabase
    .from('hsil_uf') // Certifique-se de que o nome da tabela está correto
    .select('uf, estado, ano, tx_hsil_uf, lesao, exames')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF'); // Exclui a linha de resumo do Brasil

  if (error) {
    console.error('Erro ao buscar dados de HSIL por estado:', error);
    return [];
  }

  return data || [];
}