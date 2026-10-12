import { supabase } from '../../lib/supabase';

/**
 * 1. Consulta a taxa de mortalidade a cada 100 mil mulheres para o Brasil em um determinado ano.
 */
export async function getTaxaMortalidadeBrasil(ano) {
  const { data, error } = await supabase
    .from('tx_mortalidade_ccu_uf')
    .select('tx_mortalidade_ccu')
    .eq('ano', Number(ano))
    .eq('estado', 'Total_UF')
    .single();

  if (error) {
    console.error('Erro ao buscar taxa de mortalidade:', error);
    return 0;
  }

return data?.tx_mortalidade_ccu != null ? Number(data.tx_mortalidade_ccu).toFixed(2) : "0.00";
}

/**
 * 2. Consulta o total absoluto de mortes no Brasil em um determinado ano.
 */
export async function getTotalObitosBrasil(ano) {
  const { data, error } = await supabase
    .from('tx_mortalidade_ccu_uf')
    .select('ab_mortalidade_ccu')
    .eq('ano', Number(ano))
    .eq('estado', 'Total_UF')
    .single();

  if (error) {
    console.error('Erro ao buscar total de mortes no Brasil:', error);
    return 0;
  }

  return data?.ab_mortalidade_ccu || 0;
}

/**
 * 3. Consulta o estado com a maior taxa de mortalidade em um determinado ano.
 */
export async function getPiorEstadoMortalidade(ano) {
  const { data, error } = await supabase
    .from('tx_mortalidade_ccu_uf')
    .select('estado, tx_mortalidade_ccu')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF') // ignora a linha do total do Brasil
    .order('tx_mortalidade_ccu', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar pior estado em mortalidade:', error);
    return { estado: 'N/A', taxa: 0 };
  }

  return {
    estado: data?.estado || '',
    taxa: data?.tx_mortalidade_ccu || 0
  };
}

/**
 * Função unificada para carregar o resumo do KPI de mortalidade
 */
export async function getKpiMortalidadeResumo(ano) {
  const [taxaBrasil, totalObitos, piorEstado] = await Promise.all([
    getTaxaMortalidadeBrasil(ano),
    getTotalObitosBrasil(ano),
    getPiorEstadoMortalidade(ano)
  ]);

  return {
    taxaBrasil,
    totalObitos,
    piorEstado
  };
}