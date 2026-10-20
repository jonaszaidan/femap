import { supabase } from '../../lib/supabase';

/**
 * Consulta a população alvo por idade/faixa etária para vacinação HPV,
 * dividida por sexo (Feminino e Masculino), desconsiderando '9 a 14 Anos'.
 */
export async function getPopulacaoAlvoPorFaixaVacinacao(ano) {
  const { data, error } = await supabase
    .from('vacinacao_uf')
    .select('ano_cobertura, sexo, populacao, denominador')
    .eq('ano', Number(ano))
    .neq('ano_cobertura', '9 a 14 Anos');

  if (error) {
    console.error('Erro ao buscar população por faixa etária de vacinação:', error);
    return [];
  }

  if (data && data.length > 0) {
    const agrupado = {};

    data.forEach((item) => {
      const faixa = item.ano_cobertura || 'Não informada';
      const sexoBruto = (item.sexo || '').trim().toLowerCase();
      const pop = Number(item.populacao) || Number(item.denominador) || 0;

      if (!agrupado[faixa]) {
        agrupado[faixa] = { feminino: 0, masculino: 0, total: 0 };
      }

      if (sexoBruto.startsWith('f')) {
        agrupado[faixa].feminino += pop;
      } else if (sexoBruto.startsWith('m')) {
        agrupado[faixa].masculino += pop;
      }
      agrupado[faixa].total += pop;
    });

    const resultado = Object.keys(agrupado).map((faixa) => ({
      faixa_etaria: faixa,
      feminino: agrupado[faixa].feminino,
      masculino: agrupado[faixa].masculino,
      populacao_alvo: agrupado[faixa].total,
    }));

    // Ordenação por idade (9 Anos, 10 Anos, etc.)
    resultado.sort((a, b) => {
      const numA = parseInt(a.faixa_etaria.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.faixa_etaria.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    return resultado;
  }

  return [];
}