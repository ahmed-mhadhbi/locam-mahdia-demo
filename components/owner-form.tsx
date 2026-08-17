"use client";

import { Check, Home, MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { createWhatsAppUrl, ownerMessage } from "../lib/whatsapp";
import { MessagePreview } from "./message-preview";
import { useLocale } from "./providers";

const projectOptions = ["Vente", "Location", "Location saisonnière"];
const typeOptions = ["Appartement", "Villa", "Maison", "Terrain", "Local commercial", "Autre"];

export function OwnerForm() {
  const { t } = useLocale();
  const [values, setValues] = useState<Record<string, string>>({ intent: "Location", type: "Appartement", location: "Mahdia", surface: "", rooms: "S+2", price: "", description: "", name: "", phone: "" });
  const [preview, setPreview] = useState<{ message: string; url: string } | null>(null);
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); const message = ownerMessage(values); setPreview({ message, url: createWhatsAppUrl({ message }) }); };

  return (
    <main className="owner-page">
      <section className="owner-page-intro"><div><p className="eyebrow light">Propriétaires à Mahdia</p><h1>Présentez votre bien à LOCAM.</h1><p>Rassemblez les informations essentielles. Vous pourrez vérifier le message avant de l’envoyer directement à l’agence.</p><div className="owner-trust"><span><ShieldCheck /></span><div><strong>Contact direct avec l’agence</strong><p>Aucune publication automatique. Votre demande est d’abord transmise à LOCAM.</p></div></div></div></section>
      <section className="owner-form-wrap"><form className="owner-form" onSubmit={submit}>
        <header><span><Home /></span><div><p className="eyebrow">{t.ownerProject}</p><h2>{t.tellProperty}</h2></div></header>
        <div className="owner-step"><span>01</span><div><h3>{t.intention}</h3><fieldset><legend>{t.iWant}</legend><div className="choice-cards">{projectOptions.map((option) => <label className={values.intent === option ? "active" : ""} key={option}><input type="radio" name="intent" checked={values.intent === option} onChange={() => update("intent", option)} /><Check />{option}</label>)}</div></fieldset></div></div>
        <div className="owner-step"><span>02</span><div><h3>{t.property}</h3><div className="form-row two"><label>{t.type}<select value={values.type} onChange={(event) => update("type", event.target.value)}>{typeOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label>{t.location}<input required placeholder="Mahdia, Hiboun, Rejiche…" value={values.location} onChange={(event) => update("location", event.target.value)} /></label></div><div className="form-row three"><label>{t.surface}<input required inputMode="numeric" placeholder="110" value={values.surface} onChange={(event) => update("surface", event.target.value)} /><i>m²</i></label><label>{t.configuration}<select value={values.rooms} onChange={(event) => update("rooms", event.target.value)}>{["Studio", "S+1", "S+2", "S+3", "S+4+", "Non applicable"].map((option) => <option key={option}>{option}</option>)}</select></label><label>{t.desiredPrice} <small>({t.optional})</small><input inputMode="numeric" placeholder="1 100" value={values.price} onChange={(event) => update("price", event.target.value)} /><i>DT</i></label></div><label>{t.description}<textarea rows={5} placeholder="Appartement meublé proche de la plage, avec terrasse…" value={values.description} onChange={(event) => update("description", event.target.value)} /></label></div></div>
        <div className="owner-step"><span>03</span><div><h3>{t.yourDetails}</h3><div className="form-row two"><label>{t.fullName}<input required placeholder="Ahmed Ben Salah" value={values.name} onChange={(event) => update("name", event.target.value)} /></label><label>{t.phone}<input required inputMode="tel" placeholder="+216 XX XXX XXX" value={values.phone} onChange={(event) => update("phone", event.target.value)} /></label></div><p className="privacy-line"><ShieldCheck size={16} />Ces informations sont utilisées uniquement pour préparer votre demande WhatsApp.</p><button className="button button-whatsapp owner-submit" type="submit">{t.previewSend}<MessageCircle size={19} /></button></div></div>
      </form></section>
      {preview && <MessagePreview message={preview.message} url={preview.url} onClose={() => setPreview(null)} />}
    </main>
  );
}
