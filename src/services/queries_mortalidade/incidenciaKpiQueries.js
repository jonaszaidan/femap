import { supabase } from '../../lib/supabase';

export async function getTotalIncidenciaBrasil(ano) {
  const { data, error } = await supabase
    .from('incidencia_uf')
    .select('incidencia')
    .eq('ano', Number(ano));

  console.log('[KPI incidência] ano:', ano, '| linhas:', data?.length, '| erro:', error);

  if (error) {
    console.error('Erro ao buscar total de incidência:', error);
    return 0;
  }

  const total = (data || []).reduce((soma, item) => soma + Number(item.incidencia || 0), 0);
  console.log('[KPI incidência] total:', total);
  return total;
}