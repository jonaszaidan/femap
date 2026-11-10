import { supabase } from "../../lib/supabase";

/**
 * Consulta a incidência por município em um determinado ano.
 * Se codigoUfIbge for informado (ex.: "31" para MG), filtra só os municípios dessa UF.
 * O código do município tem 7 dígitos e começa com o código da UF, por isso o like.
 *
 * @param {number|string} ano
 * @param {string} codigoUfIbge - Código IBGE da UF (opcional)
 */
export async function getIncidenciaPorMunicipio(ano, codigoUfIbge = "") {
  try {
    let query = supabase
      .from("incidencia_municipios")
      .select("codigo_ibge, cidade, ano, incidencia")
      .eq("ano", Number(ano));

    if (codigoUfIbge) {
      query = query.like("codigo_ibge", `${codigoUfIbge}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro em getIncidenciaPorMunicipio:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getIncidenciaPorMunicipio:", err);
    return [];
  }
}