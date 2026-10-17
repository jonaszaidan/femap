/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = '';
if (isGithubActions) {
  const gitHubRepo = process.env.GITHUB_REPOSITORY;
  if (gitHubRepo) {
    repo = gitHubRepo.split('/')[1];
  }
}

const assetPrefix = repo ? `/${repo}/` : '';
const basePath = repo ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true, // 👈 ADICIONE ESTA LINHA (Gera diretórios com index.html para o GitHub Pages)
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;