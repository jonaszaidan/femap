import { supabase } from '../../lib/supabase';

/**
 * Consulta os 10 municípios com as menores taxas de cobertura vacinal (9 a 14 Anos).
 * @param {number | string} ano
 * @param {string | null} [sexo]
 */
export async function getTop10MenoresCoberturaVacinalMunicipios(ano, sexo = null) {
  let query = supabase
    .from('vacinacao_municipios')
    .select('id, uf, codigo_ibge, municipio, sexo, ano, doses, populacao, tx_cobertura')
    .eq('ano', Number(ano))
    .eq('ano_cobertura', '9 a 14 Anos');
  

  // Se houver um filtro de sexo específico
  if (sexo) {
    // Normaliza para garantir que a primeira letra seja maiúscula ("Feminino" / "Masculino")
    const sexoFormatado = String(sexo).charAt(0).toUpperCase() + String(sexo).slice(1).toLowerCase();
    query = query.eq('sexo', sexoFormatado);
  }

  query = query
    .order('tx_cobertura', { ascending: true, nullsFirst: false })
    .limit(10);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar os 10 municípios com menor cobertura vacinal:', error);
    return [];
  }

  return (data || []).map((item) => ({
    uf: item.uf,
    codigo_ibge: item.codigo_ibge,
    municipio: item.municipio,
    sexo: item.sexo,
    ano: Number(item.ano),
    doses: Number(item.doses || 0),
    populacao: Number(item.populacao || 0),
    tx_cobertura: Number(item.tx_cobertura || 0),
  }));
}