"use client";

import { useState } from "react";
import { Heart, Menu, MessageCircle, X } from "lucide-react";
import { useFavorites, useLocale } from "./providers";
import { createWhatsAppUrl } from "../lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  const { favorites, hydrated } = useFavorites();
  const { locale, setLocale, t } = useLocale();
  const nav = [
    [t.home, "/"], [t.rent, "/properties?transaction=rent"], [t.sale, "/properties?transaction=sale"],
    [t.vacation, "/properties?transaction=vacation"], [t.properties, "/properties"], [t.contact, "/#contact"],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="LOCAM — Accueil">
          <strong>LOCAM</strong><span>IMMOBILIER • MAHDIA</span>
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Langue">
            <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")} type="button">FR</button>
            <span>/</span>
            <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} type="button">EN</button>
          </div>
          <a className="icon-link favorites-link" href="/favorites" aria-label={`${t.favorites} (${hydrated ? favorites.length : 0})`}>
            <Heart size={18} /> <span>{t.favorites}</span><b>{hydrated ? favorites.length : 0}</b>
          </a>
          <a className="button button-dark header-submit" href="/proposer">{t.submit}</a>
          <a className="icon-link header-whatsapp" target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message: "Bonjour LOCAM 👋\n\nJe souhaite obtenir des informations sur vos services immobiliers à Mahdia." })}><MessageCircle size={17} />{t.whatsapp}</a>
          <button className="menu-button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu" type="button"><Menu /></button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Fermer le menu" type="button"><X /></button>
        <a className="brand mobile-brand" href="/"><strong>LOCAM</strong><span>IMMOBILIER • MAHDIA</span></a>
        <nav aria-label="Navigation mobile">
          {nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a href="/favorites" onClick={() => setOpen(false)}>{t.favorites} ({hydrated ? favorites.length : 0})</a>
        </nav>
        <a className="button button-accent" href="/proposer">{t.submit}</a>
      </div>
      {open && <button className="menu-scrim" onClick={() => setOpen(false)} aria-label="Fermer le menu" type="button" />}
    </header>
  );
}
