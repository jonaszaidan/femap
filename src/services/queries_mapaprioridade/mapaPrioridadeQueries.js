import { supabase } from '../../lib/supabase';

/**
 * Consulta os dados do mapa de prioridade unindo a tabela de mortalidade municipal 
 * com a tabela de municípios (para obter latitude, longitude e código do IBGE) para um determinado ano.
 * @param {number|string} ano
 */
export async function getDadosMapaPrioridade(ano) {
  const { data, error } = await supabase
    .from('tx_mortalidade_ccu')
    .select(`
      municipio,
      ano,
      tx_mortalidade,
      codigo_ibge,
      municipios (
        codigo_ibge,
        nome,
        latitude,
        longitude,
        capital,
        codigo_uf,
        siafi_id
      )
    `)
    .eq('ano', Number(ano));

  if (error) {
    console.error('Erro ao buscar dados do mapa de prioridade:', error);
    return [];
  }

  // Opcional: formata o retorno para achatar o objeto se o componente esperar a estrutura unificada
  const dadosFormatados = (data || []).map((item) => ({
    municipio: item.municipio,
    ano: item.ano,
    tx_mortalidade: item.tx_mortalidade ?? 0,
    codigo_ibge: item.codigo_ibge,
    // Se a relação retornar um array ou objeto único, unificamos os dados do IBGE
    latitude: Array.isArray(item.municipios) ? item.municipios[0]?.latitude : item.municipios?.latitude,
    longitude: Array.isArray(item.municipios) ? item.municipios[0]?.longitude : item.municipios?.longitude,
    capital: Array.isArray(item.municipios) ? item.municipios[0]?.capital : item.municipios?.capital,
    codigo_uf: Array.isArray(item.municipios) ? item.municipios[0]?.codigo_uf : item.municipios?.codigo_uf,
  }));

  return dadosFormatados;
}