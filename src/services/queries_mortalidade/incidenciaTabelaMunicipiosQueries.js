import { supabase } from "../../lib/supabase";

/**
 * Consulta o Top 10 municípios com maior incidência (nº de casos) em um determinado ano.
 * Se codigoUfIbge for informado (ex.: "31" para MG), considera só os municípios dessa UF.
 *
 * @param {number|string} ano
 * @param {string} codigoUfIbge - Código IBGE da UF (opcional)
 */
export async function getTop10IncidenciaMunicipios(ano, codigoUfIbge = "") {
  try {
    let query = supabase
      .from("incidencia_municipios")
      .select("codigo_ibge, cidade, ano, incidencia")
      .eq("ano", Number(ano));

    if (codigoUfIbge) {
      query = query.like("codigo_ibge", `${codigoUfIbge}%`);
    }

    const { data, error } = await query
      .order("incidencia", { ascending: false })
      .order("cidade", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Erro em getTop10IncidenciaMunicipios:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getTop10IncidenciaMunicipios:", err);
    return [];
  }
}