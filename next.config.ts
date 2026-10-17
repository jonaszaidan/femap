/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = '';
if (isGithubActions) {
  const gitHubRepo = process.env.GITHUB_REPOSITORY;
  if (gitHubRepo) {
    repo = gitHubRepo.split('/')[1];
  }
}

const basePath = repo ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;