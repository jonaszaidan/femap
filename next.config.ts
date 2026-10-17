import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Ativa a exportação estática e o basePath apenas no GitHub Actions
  ...(isGithubActions && {
    output: "export",
    basePath: "/femap",
  }),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;