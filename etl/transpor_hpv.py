import pandas as pd

df = pd.read_excel("etl/imput/vacinacao_hpv.xlsx")

linhas = []

idades = [
    ("9", "Cobertura 9 Anos", "Doses 9 Anos", "Denominador 9 Anos"),
    ("10", "Cobertura 10 Anos", "Doses 10 Anos", "Denominador 10 Anos"),
    ("11", "Cobertura 11 Anos", "Doses 11 Anos", "Denominador 11 Anos"),
    ("12", "Cobertura 12 Anos", "Doses 12 Anos", "Denominador 12 Anos"),
    ("13", "Cobertura 13 Anos", "Doses 13 Anos", "Denominador 13 Anos"),
    ("14", "Cobertura 14 Anos", "Doses 14 Anos", "Denominador 14 Anos"),
]

for _, row in df.iterrows():

    linhas.append({
        "regiao": row["Região"],
        "uf": row["UF"],
        "macrorregiao_saude": row["Macrorregião de Saúde"],
        "regiao_saude": row["Região de Saúde"],
        "municipio": row["Município"],
        "sexo": row["Sexo"],
        "faixa_etaria": "9-14",
        "cobertura": row["Cobertura 9 a 14 Anos"],
        "doses": row["Doses 9 a 14 Anos"],
        "populacao": row["População 9 a 14 Anos"],
    })

    for idade, cob, dose, pop in idades:
        linhas.append({
            "regiao": row["Região"],
            "uf": row["UF"],
            "macrorregiao_saude": row["Macrorregião de Saúde"],
            "regiao_saude": row["Região de Saúde"],
            "municipio": row["Município"],
            "sexo": row["Sexo"],
            "faixa_etaria": idade,
            "cobertura": row[cob],
            "doses": row[dose],
            "populacao": row[pop],
        })

resultado = pd.DataFrame(linhas)

resultado.to_csv(
    "etl/output/vacinacao_hpv_normalizada.csv",
    index=False,
    encoding="utf-8-sig"
)

print("Arquivo gerado com sucesso.")