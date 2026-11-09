import { supabase } from '../../lib/supabase';

/**
 * Consulta as taxas de mortalidade por estado/UF para um determinado ano (usado no Mapa de Mortalidade).
 * @param {number|string} ano
 */
export async function getIncidenciaPorEstado(ano) {
  const { data, error } = await supabase
    .from('incidencia_uf')
    .select('estado, uf, ano, incidencia')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF'); // Ignora o registro geral do Brasil

  if (error) {
    console.error('Erro ao buscar dados de mortalidade por estado:', error);
    return [];
  }

  return data || [];
}