import { supabase } from '../../lib/supabase';

/**
 * 1. Consulta a taxa geral de HSIL a cada 100 mil exames para o Brasil em um determinado ano.
 */
export async function getTaxaHsilBrasil(ano) {
  const { data, error } = await supabase
    .from('hsil_uf') // Substitua pelo nome real da sua tabela se for diferente
    .select('tx_hsil_100m')
    .eq('ano', Number(ano))
    .eq('estado', 'Total_UF')
    .single();

  if (error) {
    console.error('Erro ao buscar taxa de HSIL:', error);
    return "0.00";
  }

  return data?.tx_hsil_100m != null ? Number(data.tx_hsil_100m).toFixed(2) : "0.00";
}

/**
 * 2. Consulta o total absoluto de resultados/exames de HSIL no Brasil em um determinado ano.
 */
export async function getTotalResultadosHsilBrasil(ano) {
  const { data, error } = await supabase
    .from('hsil_uf')
    .select('lesao') // ou a coluna correspondente ao total absoluto de resultados
    .eq('ano', Number(ano))
    .eq('estado', 'Total_UF')
    .single();

  if (error) {
    console.error('Erro ao buscar total de resultados de HSIL:', error);
    return 0;
  }

  return data?.lesao || 0;
}

/**
 * 3. Consulta o estado com a maior taxa de HSIL em um determinado ano.
 */
export async function getPiorEstadoHsil(ano) {
  const { data, error } = await supabase
    .from('hsil_uf')
    .select('estado, tx_hsil_100m')
    .eq('ano', Number(ano))
    .neq('estado', 'Total_UF') // ignora a linha do total do Brasil
    .order('tx_hsil_100m', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Erro ao buscar pior estado em HSIL:', error);
    return { estado: 'N/A', taxa: 0 };
  }

  return {
    estado: data?.estado || '',
    taxa: data?.tx_hsil_100m || 0
  };
}

/**
 * Função unificada para carregar o resumo do KPI de HSIL
 */
export async function getKpiHsilResumo(ano) {
  const [taxaBrasil, totalResultados, piorEstado] = await Promise.all([
    getTaxaHsilBrasil(ano),
    getTotalResultadosHsilBrasil(ano),
    getPiorEstadoHsil(ano)
  ]);

  return {
    taxaBrasil,
    totalResultados,
    piorEstado
  };
}