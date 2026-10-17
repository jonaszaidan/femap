import { supabase } from '../../lib/supabase';

export async function getTop10MortalidadeMunicipios(ano, codigoUfIbge) {
  try {
    let query = supabase
      .from("tx_mortalidade_ccu")
      .select("municipio, codigo_ibge, tx_mortalidade, ano")
      .eq("ano", Number(ano))
      .order("tx_mortalidade", { ascending: false })
      .limit(10);

    if (codigoUfIbge) {
      query = query.like("codigo_ibge", `${codigoUfIbge}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro em getTop10MortalidadeMunicipios:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getTop10MortalidadeMunicipios:", err);
    return [];
  }
}