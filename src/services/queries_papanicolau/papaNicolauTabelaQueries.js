import { supabase } from '../../lib/supabase';

/**
 * Consulta os 10 municípios com as menores taxas de cobertura de Papanicolaou para um determinado ano.
 */
export async function getTop10MenoresCoberturasMunicipios(ano) {
  let query = supabase
    .from('coleta_papa_nicolau_municipios')
    .select('uf, codigo_ibge, municipio, ano, cobertura')
    .eq('ano', Number(ano))
    .not('cobertura', 'is', null) // Filtra registros sem taxa de cobertura
    .order('cobertura', { ascending: true }) // Ordenação crescente (menores taxas primeiro)
    .limit(10); // Retorna apenas os 10 primeiros

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar os 10 municípios com menor cobertura:', error);
    return [];
  }

  if (data && data.length > 0) {
    return data.map((item) => ({
      uf: item.uf,
      codigo_ibge: item.codigo_ibge,
      municipio: item.municipio,
      ano: Number(item.ano),
      cobertura: Number(item.cobertura || 0),
    }));
  }

  return [];
}