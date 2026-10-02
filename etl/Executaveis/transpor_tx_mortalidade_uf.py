import pandas as pd

ARQUIVO_ENTRADA = "etl/input/TX_Mortalidade_CCU_UF.csv"

ARQUIVO_SAIDA = (
    "etl/output/tx_mortalidade_ccu_uf_normalizada.csv"
)

df = pd.read_csv(
    ARQUIVO_ENTRADA,
    sep=";",
    encoding="latin1",
    skiprows=2
)
print(df.columns.tolist())
# remove coluna vazia que vem no fim
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

# remove linha Total_UF
df = df[df["Estados"] != "Total_UF"]

resultado = []

anos = [
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
]

for _, row in df.iterrows():

    uf = row["Estados"]

    for ano in anos:

        valor = str(row[ano]).replace(",", ".")

        resultado.append({
            "uf": uf,
            "ano": int(ano),
            "tx_mortalidade_ccu": float(valor)
        })

resultado = pd.DataFrame(resultado)

resultado.to_csv(
    ARQUIVO_SAIDA,
    index=False,
    encoding="utf-8-sig"
)

print(
    f"Arquivo gerado com sucesso: "
    f"{ARQUIVO_SAIDA}"
)

print(
    f"Total de registros: "
    f"{len(resultado)}"
)