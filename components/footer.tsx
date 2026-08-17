"use client";

import { MessageCircle, Phone } from "lucide-react";
import { createWhatsAppUrl } from "../lib/whatsapp";
import { useLocale } from "./providers";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><strong>LOCAM</strong><span>IMMOBILIER • MAHDIA</span><p>{t.footerTagline}</p></div>
        <div className="footer-links"><span>{t.explore}</span><a href="/properties?transaction=rent">{t.rent}</a><a href="/properties?transaction=sale">{t.sale}</a><a href="/properties?transaction=vacation">{t.vacation}</a><a href="/properties">{t.properties}</a></div>
        <div className="footer-links"><span>{t.yourProject}</span><a href="/proposer">{t.listProperty}</a><a href="/#recherche">{t.describeSearch}</a><a href="/favorites">{t.myFavorites}</a><a href="/#contact">{t.contact}</a></div>
        <div className="footer-contact"><span>{t.directContact}</span><a href="tel:+21658023092"><Phone size={16} /> +216 58 023 092</a><a target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message: "Bonjour LOCAM 👋\n\nJe souhaite échanger avec votre agence à Mahdia." })}><MessageCircle size={16} /> {t.whatsapp}</a><p>255 Avenue Habib Bourguiba<br />Mahdia, Tunisie</p></div>
      </div>
      <div className="footer-bottom"><p>{t.demoDisclaimer}</p><p>{t.prototypeDisclaimer}</p></div>
    </footer>
  );
}
