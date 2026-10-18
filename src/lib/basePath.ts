// Adiciona o basePath (ex.: "/femap" no GitHub Pages) a caminhos de arquivos
// da pasta public. Localmente o basePath é vazio, então nada muda.
export const withBasePath = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;