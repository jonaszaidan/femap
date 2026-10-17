import { supabase } from '../../lib/supabase';

export async function getTop10HsilMunicipios(ano, codigoUfIbge) {
  try {
    let query = supabase
      .from("hsil_municipios")
      .select("municipio, codigo_ibge, tx_hsil_municipio, ano")
      .eq("ano", Number(ano))
      .order("tx_hsil_municipio", { ascending: false })
      .limit(10);

    if (codigoUfIbge) {
      query = query.like("codigo_ibge", `${codigoUfIbge}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro em getTop10HsilMunicipios:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getTop10HsilMunicipios:", err);
    return [];
  }
}