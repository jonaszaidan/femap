import { supabase } from "../../lib/supabase";

/**
 * Busca a evolução da taxa de cobertura de rastreamento (SISAB) ao longo dos anos
 * para a referência nacional ("Total_UF" ou estado específico).
 */
export async function getEvolucaoRastreamentoPapaNicolau(estado = "Total_UF") {
  const { data, error } = await supabase
    .from("coleta_papa_nicolau_uf")
    .select("ano, media_tx_coleta_uf")
    .eq("estado", estado)
    .order("ano", { ascending: true }); // Ordena de forma crescente (ex: 2020 a 2026)

  if (error) {
    console.error("Erro ao buscar evolução do rastreamento de Papanicolau:", error);
    return [];
  }

  // Mapeia e formata os dados para o gráfico
  return (data || []).map((item) => ({
    ano: Number(item.ano),
    media_tx_coleta_uf: item.media_tx_coleta_uf ? Number(item.media_tx_coleta_uf) : 0,
  }));
}