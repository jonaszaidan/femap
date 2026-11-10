import { supabase } from "../../lib/supabase";

/**
 * Consulta o Top 10 estados com maior incidência (nº de casos) em um determinado ano.
 * @param {number|string} ano
 */
export async function getTop10Incidencia(ano) {
  try {
    const { data, error } = await supabase
      .from("incidencia_uf")
      .select("uf, estado, ano, incidencia")
      .eq("ano", Number(ano))
      .order("incidencia", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Erro em getTop10Incidencia:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getTop10Incidencia:", err);
    return [];
  }
}