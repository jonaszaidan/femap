import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = '';
if (isGithubActions) {
  const gitHubRepo = process.env.GITHUB_REPOSITORY;
  if (gitHubRepo) {
    repo = gitHubRepo.split('/')[1];
  }
}

const basePath = repo ? `/${repo}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  // Expõe o basePath para o código que roda no navegador (fetch de /mapas/..., etc.)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;