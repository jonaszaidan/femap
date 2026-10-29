import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer"; // Importando o Footer que criamos

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FemMap | Plataforma Inteligente de Saúde da Mulher",
  description:
    "FemMap ajuda gestores e equipes a monitorar indicadores de saúde da mulher.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F0E2F0] text-slate-900">
        {/* Conteúdo principal das páginas */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Rodapé fixo ao final de todas as telas */}
        <Footer />
      </body>
    </html>
  );
}