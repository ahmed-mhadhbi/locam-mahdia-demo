"use client";

import { Heart, MessageCircle, Search, Trash2 } from "lucide-react";
import { properties } from "../data/properties";
import { createWhatsAppUrl, favoritesMessage } from "../lib/whatsapp";
import { useFavorites, useLocale } from "./providers";
import { PropertyCard } from "./property-card";

export function FavoritesClient() {
  const { favorites, toggleFavorite, hydrated } = useFavorites();
  const { t } = useLocale();
  const selected = properties.filter((property) => favorites.includes(property.reference));
  const message = favoritesMessage(selected);

  return (
    <main className="favorites-page">
      <section className="subpage-hero"><div className="container"><p className="eyebrow light">Votre sélection personnelle</p><h1>Vos biens favoris.</h1><p>Comparez votre sélection et contactez LOCAM pour recevoir les informations en une seule demande.</p></div></section>
      <section className="section container">
        {!hydrated ? <div className="favorites-loading">Chargement de votre sélection…</div> : selected.length ? <>
          <div className="favorites-toolbar"><p><strong>{selected.length}</strong> bien{selected.length > 1 ? "s" : ""} enregistré{selected.length > 1 ? "s" : ""}</p><a className="button button-whatsapp" target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message })}><MessageCircle size={18} />Demander des informations sur mes favoris</a></div>
          <div className="favorites-list">{selected.map((property) => <div className="favorite-row" key={property.reference}><PropertyCard property={property} compact /><button className="remove-favorite" onClick={() => toggleFavorite(property.reference)} type="button"><Trash2 size={16} />{t.remove}</button></div>)}</div>
          <div className="multi-lead-card"><span><MessageCircle /></span><div><p className="eyebrow">{t.groupedRequest}</p><h2>Un seul message, toutes vos références.</h2><p>LOCAM recevra automatiquement la liste de vos {selected.length} favoris et pourra vous confirmer les disponibilités.</p></div><a className="button button-accent" target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message })}>{t.sendWhatsApp}</a></div>
        </> : <div className="empty-favorites"><span><Heart /></span><p className="eyebrow">{t.emptyFavorites}</p><h2>Gardez vos coups de cœur sous la main.</h2><p>Ajoutez des biens à vos favoris depuis les fiches ou les résultats. Votre sélection restera disponible sur cet appareil.</p><a className="button button-dark" href="/properties"><Search size={18} />{t.exploreProperties}</a></div>}
      </section>
    </main>
  );
}
