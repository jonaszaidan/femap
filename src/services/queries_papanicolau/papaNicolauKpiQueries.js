import { supabase } from '../../lib/supabase';

/**
 * Consulta os dados de KPIs e total de exames de Papanicolau por ano e/ou município.
 */
export async function getTotalExamesPapaNicolau(ano, estado = 'Total') {
  let query = supabase
    .from('exames_papa_nicolau_uf') 
    .select('estado, uf, exames') // <-- Ajustado de total_exames para exames
    .eq('ano', Number(ano));

  if (!estado || estado === 'Total') {
    query = query.eq('estado', 'Total_UF');
  } else {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar KPIs e total de exames de Papanicolau:', error);
    return null;
  }

  // Mapeia o campo 'exames' para a propriedade esperada pelo componente
  const registro = data && data.length > 0 ? data[0] : null;
  
  if (registro) {
    return {
      total_exames: registro.exames
    };
  }

  return null;
}


//CONSULTA TAXA SISAB  por ano
export async function getTotalTaxaSisabPapaNicolau(ano, estado = 'Total_UF') {
  let query = supabase
    .from('coleta_papa_nicolau_uf') 
    .select('estado, uf, media_tx_coleta_uf') // <-- Ajustado de total_exames para exames
    .eq('ano', Number(ano));

  if (!estado || estado === 'Total') {
    query = query.eq('estado', 'Total_UF');
  } else {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar KPIs e total de exames de Papanicolau:', error);
    return null;
  }

  // Mapeia o campo 'media_tx_coleta_uf' para a propriedade esperada pelo componente
  const registro = data && data.length > 0 ? data[0] : null;
  
  if (registro) {
    return {
      media_tx_coleta_uf: registro.media_tx_coleta_uf
    };
  }

  return null;
}