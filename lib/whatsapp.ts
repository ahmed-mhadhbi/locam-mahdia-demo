import type { Property } from "../data/properties";
import { formatPrice, transactionLabels } from "../data/properties";

export const LOCAM_PHONE = "21658023092";

export function createWhatsAppUrl({ phone = LOCAM_PHONE, message }: { phone?: string; message: string }) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function propertyEnquiryMessage(property: Property, name = "", clientPhone = "") {
  return `Bonjour LOCAM 👋\n\nJe suis intéressé(e) par ce bien :\n\n🏠 REF : ${property.reference}\n${property.title}\n\n📍 ${property.location}\n🔑 Transaction : ${transactionLabels[property.transactionType]}\n💰 Prix affiché : ${formatPrice(property)}\n\n${name ? `👤 Nom : ${name}\n` : ""}${clientPhone ? `📱 Téléphone : ${clientPhone}\n\n` : ""}Pouvez-vous me confirmer la disponibilité ?`;
}

export function visitMessage(property: Property, values: { date: string; moment: string; name: string; phone: string; note?: string }) {
  const date = values.date ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${values.date}T12:00:00`)) : "À convenir";
  return `Bonjour LOCAM 👋\n\nJe suis intéressé(e) par ce bien :\n\n🏠 REF : ${property.reference}\n${property.title}\n\n📍 ${property.location}\n🔑 Transaction : ${transactionLabels[property.transactionType]}\n💰 Prix affiché : ${formatPrice(property)}\n\nJe souhaite organiser une visite.\n\n📅 Date souhaitée : ${date}\n🕒 Moment : ${values.moment}\n\n👤 Nom : ${values.name}\n📱 Téléphone : ${values.phone}${values.note ? `\n\n💬 Message : ${values.note}` : ""}\n\nPouvez-vous me confirmer la disponibilité ?`;
}

export function favoritesMessage(items: Property[]) {
  const list = items.map((property) => `• ${property.reference} — ${property.shortTitle} — ${property.zone}`).join("\n");
  return `Bonjour LOCAM 👋\n\nJe suis intéressé(e) par plusieurs biens :\n\n${list}\n\nPouvez-vous m'envoyer plus d'informations et me confirmer lesquels sont toujours disponibles ?`;
}

export function vacationMessage(property: Property, values: { arrival: string; departure: string; guests: string }) {
  const format = (date: string) => date ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${date}T12:00:00`)) : "À préciser";
  return `Bonjour LOCAM 👋\n\nJe souhaite vérifier la disponibilité du bien ${property.reference} pour mes vacances.\n\n📅 Arrivée : ${format(values.arrival)}\n📅 Départ : ${format(values.departure)}\n👥 Voyageurs : ${values.guests}\n\nPouvez-vous confirmer la disponibilité et le tarif ?`;
}

export function requirementMessage(values: Record<string, string>, zones: string[], criteria: string[]) {
  const criterionList = criteria.length ? criteria.map((item) => `• ${item}`).join("\n") : "• Aucun critère spécifique";
  return `Bonjour LOCAM 👋\n\nJe recherche actuellement un bien.\n\n🔑 Recherche : ${values.intent}\n🏠 Type : ${values.type}\n📍 Zone : ${zones.join(" / ") || "Mahdia"}\n🛏 Configuration : ${values.rooms}\n💰 Budget : ${values.minBudget || "—"} – ${values.maxBudget || "—"} DT${values.intent === "Location" ? " / mois" : ""}\n🛋 Meublé : ${values.furnished}\n\nCritères :\n${criterionList}\n\n📅 À partir de : ${values.date || "À convenir"}\n\n👤 ${values.name}\n📱 ${values.phone}\n\nPouvez-vous me proposer des biens correspondant à cette recherche ?`;
}

export function ownerMessage(values: Record<string, string>) {
  return `Bonjour LOCAM 👋\n\nJe souhaite proposer un bien.\n\n🔑 Projet : ${values.intent}\n🏠 Type : ${values.type}\n📍 Localisation : ${values.location}\n📐 Surface : ${values.surface || "Non précisée"}${values.surface ? " m²" : ""}\n🛏 Configuration : ${values.rooms || "Non précisée"}\n💰 Prix souhaité : ${values.price || "À discuter"}${values.price ? " DT" : ""}\n\nDescription :\n${values.description || "À compléter ensemble."}\n\n👤 Propriétaire : ${values.name}\n📱 Téléphone : ${values.phone}\n\nPouvez-vous me contacter pour en discuter ?`;
}
