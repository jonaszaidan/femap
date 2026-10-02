import pandas as pd

# Ler CSV
df = pd.read_csv(
    "etl/input/TX_Mortalidade_CCU.csv",
    sep=";",
    decimal=",",
    encoding="latin1",
    skiprows=1
    
)

# Remover colunas vazias criadas pelo ';' final
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]
df = df.dropna(axis=1, how="all")

# Limpar nome do município
df["Municípios"] = df["Municípios"].str.rstrip(";").str.strip()

# Identificar colunas de ano
anos = [col for col in df.columns if col.isdigit()]

# Transformar anos em linhas
df_long = df.melt(
    id_vars=["Municípios"],
    value_vars=anos,
    var_name="ANO",
    value_name="TX_Mortalidade"
)

# Converter tipos
df_long["ANO"] = df_long["ANO"].astype(int)
df_long["TX_Mortalidade"] = pd.to_numeric(
    df_long["TX_Mortalidade"],
    errors="coerce"
).fillna(0)

print(df_long.head())

# Salvar
df_long.to_csv(
    "etl/output/TX_mortalidade_tratada.csv",
    sep=";",
    decimal=",",
    index=False
)