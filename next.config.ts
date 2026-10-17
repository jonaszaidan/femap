//import type { NextConfig } from "next";

//const nextConfig: NextConfig = {
  /* config options here */
//};

//export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // gera HTML estático na pasta /out
  basePath: "/femap",     // seu site fica em /femap/, não na raiz
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
