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
  images: {
    unoptimized: true,
  },
};

export default nextConfig;