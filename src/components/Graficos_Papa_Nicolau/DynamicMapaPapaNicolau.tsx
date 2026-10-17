"use client";

import dynamic from "next/dynamic";

const MapaPapaNicolau_UF = dynamic(
  () => import("./MapaPapaNicolau_UF"),
  { ssr: false }
);

interface DynamicMapaProps {
  ano?: number | string;
  coletaUFAno?: any[];
}

export default function DynamicMapaPapaNicolau(props: DynamicMapaProps) {
  return <MapaPapaNicolau_UF {...props} />;
}