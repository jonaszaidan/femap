import { supabase } from "../../lib/supabase";

// 1. Dicionário de conversão de UF para código IBGE
// Adicione o tipo Record<string, string> na exportação:
export const UF_PARA_CODIGO_IBGE= {
  RO: "11", AC: "12", AM: "13", RR: "14", PA: "15", AP: "16", TO: "17",
  MA: "21", PI: "22", CE: "23", RN: "24", PB: "25", PE: "26", AL: "27",
  SE: "28", BA: "29", MG: "31", ES: "32", RJ: "33", SP: "35", PR: "41",
  SC: "42", RS: "43", MS: "50", MT: "51", GO: "52", DF: "53",
};

// 2. Query de Mortalidade por Estado (UF)
export async function getMortalidadePorEstado(ano) {
  try {
    const { data, error } = await supabase
      .from("tx_mortalidade_ccu_uf")
      .select("uf, estado, ano, tx_mortalidade_ccu")
      .eq("ano", Number(ano));

    if (error) {
      console.error("Erro em getMortalidadePorEstado:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getMortalidadePorEstado:", err);
    return [];
  }
}

// 3. Query de Mortalidade por Município
export async function getMortalidadePorMunicipio(ano, codigoUfIbge = "") {
  try {
    let query = supabase
      .from("tx_mortalidade_ccu")
      .select("municipio, ano, tx_mortalidade, codigo_ibge")
      .eq("ano", Number(ano));

    if (codigoUfIbge) {
      query = query.like("codigo_ibge", `${codigoUfIbge}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro em getMortalidadePorMunicipio:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Erro inesperado em getMortalidadePorMunicipio:", err);
    return [];
  }
}