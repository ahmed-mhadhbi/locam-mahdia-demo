import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, properties } from "../../../data/properties";
import { PropertyDetailClient } from "../../../components/property-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ reference: string }> }): Promise<Metadata> {
  const { reference } = await params;
  const property = getProperty(reference);
  if (!property) return { title: "Bien introuvable | LOCAM Mahdia" };
  const title = `${property.title} | ${property.reference} | LOCAM Mahdia`;
  const description = `${property.title} à ${property.location}. Consultez les caractéristiques et demandez une visite directement à LOCAM via WhatsApp.`;
  return {
    title, description,
    openGraph: { title, description, type: "website", images: [{ url: property.images[0], alt: property.title }] },
    twitter: { card: "summary_large_image", title, description, images: [property.images[0]] },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const property = getProperty(reference);
  if (!property) notFound();
  const related = properties.filter((item) => item.reference !== property.reference && (item.zone === property.zone || item.transactionType === property.transactionType)).slice(0, 3);
  return <PropertyDetailClient property={property} related={related} />;
}
