import { supabase } from '../../lib/supabase';

/**
 * Consulta a taxa de coleta de exames de Papanicolau por UF para um determinado ano,
 * excluindo a linha de totalização nacional (Total_UF).
 */
export async function getColetaPapaNicolauPorEstado(ano) {
  const { data, error } = await supabase
    .from('coleta_papa_nicolau_uf')
    .select('uf, estado, ano, media_tx_coleta_uf')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF'); // Exclui a linha de resumo do Brasil, se houver

  if (error) {
    console.error('Erro ao buscar dados de coleta de Papanicolau por estado:', error);
    return [];
  }

  return data || [];
}