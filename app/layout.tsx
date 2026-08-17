import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "../components/providers";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host") || "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "LOCAM Mahdia | Agence immobilière à Mahdia";
  const description = "Découvrez des biens à louer, à vendre et des locations vacances à Mahdia. Recherchez votre bien et contactez LOCAM directement via WhatsApp.";
  const socialImage = new URL("/og.png", base).toString();
  return {
    metadataBase: base, title, description,
    openGraph: { title, description, type: "website", locale: "fr_TN", siteName: "LOCAM Immobilier Mahdia", images: [{ url: socialImage, width: 1792, height: 920, alt: "LOCAM Immobilier Mahdia — Votre prochain chez-vous à Mahdia" }] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr"><body><Providers><Header />{children}<Footer /></Providers></body></html>
  );
}
