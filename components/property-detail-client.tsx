"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Bath, BedDouble, CalendarDays, Car, Check, ChevronLeft, ChevronRight, Expand, MapPin, Maximize2, MessageCircle, Phone, Snowflake, Sofa, Waves, X } from "lucide-react";
import type { Property } from "../data/properties";
import { formatPrice, transactionLabels } from "../data/properties";
import { createWhatsAppUrl, propertyEnquiryMessage, visitMessage } from "../lib/whatsapp";
import { MessagePreview } from "./message-preview";
import { PropertyCard } from "./property-card";
import { DetailFavorite } from "./detail-favorite";
import { useLocale } from "./providers";

export function PropertyDetailClient({ property, related }: { property: Property; related: Property[] }) {
  const { t } = useLocale();
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [lead, setLead] = useState({ name: "", phone: "", contact: "WhatsApp" });
  const [visit, setVisit] = useState({ date: "", moment: "Après-midi", name: "", phone: "", note: "" });
  const [preview, setPreview] = useState<{ message: string; url: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") setActiveImage((current) => (current + 1) % property.images.length);
      if (event.key === "ArrowLeft") setActiveImage((current) => (current - 1 + property.images.length) % property.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, property.images.length]);

  function submitLead(event: React.FormEvent) {
    event.preventDefault();
    if (lead.contact === "Appel") {
      window.location.href = "tel:+21658023092";
      return;
    }
    const message = propertyEnquiryMessage(property, lead.name, lead.phone);
    setPreview({ message, url: createWhatsAppUrl({ message }) });
  }

  function submitVisit(event: React.FormEvent) {
    event.preventDefault();
    const message = visitMessage(property, visit);
    setVisitOpen(false);
    setPreview({ message, url: createWhatsAppUrl({ message }) });
  }

  const amenities = [
    [<Maximize2 key="surface" />, `${property.surface} m²`], [<BedDouble key="bed" />, property.bedrooms ? `${property.bedrooms} ${t.bedrooms}` : property.roomsLabel],
    [<Bath key="bath" />, `${property.bathrooms} ${t.bathroom}`],
    property.furnished && [<Sofa key="furnished" />, t.furnished], property.airConditioning && [<Snowflake key="air" />, t.airConditioning],
    property.seaView && [<Waves key="sea" />, t.seaView], property.parking && [<Car key="parking" />, t.parking], property.terrace && [<Check key="terrace" />, t.terrace],
  ].filter(Boolean) as [React.ReactNode, string][];

  return (
    <main className="detail-page">
      <div className="detail-topbar container"><a href="/properties"><ArrowLeft size={17} />{t.backProperties}</a><span>{t.availableDemo}</span></div>
      <section className="gallery container">
        <button className="gallery-main" onClick={() => setLightbox(true)} type="button"><img src={property.images[activeImage]} alt={`${property.title} — vue ${activeImage + 1}`} /><span><Expand size={17} />Agrandir</span></button>
        <div className="gallery-thumbs">{property.images.slice(0, 3).map((image, index) => <button className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} key={image} type="button"><img src={image} alt={`Vue ${index + 1} de ${property.title}`} />{index === 2 && <span>+{property.images.length - 2}</span>}</button>)}</div>
      </section>

      <div className="detail-layout container">
        <article className="detail-content">
          <header className="property-header">
            <div className="detail-badges"><span className={`property-badge ${property.transactionType}`}>{property.transactionType === "rent" ? t.rent : property.transactionType === "sale" ? t.sale : t.vacation}</span><span>REF : {property.reference}</span></div>
            <div className="title-row"><div><h1>{property.title}</h1><p><MapPin size={17} />{property.location}</p></div><DetailFavorite reference={property.reference} /></div>
            <strong className="detail-price">{formatPrice(property)}</strong>
          </header>
          <div className="key-info">{amenities.slice(0, 6).map(([icon, label]) => <div key={label}><span>{icon}</span><b>{label}</b></div>)}</div>
          <section className="detail-section"><p className="eyebrow">{t.aboutProperty}</p><h2>Un cadre pensé pour votre quotidien.</h2><p className="detail-description">{property.description}</p><p>Cette fiche fait partie du prototype LOCAM. Les caractéristiques, le tarif et la disponibilité sont présentés pour illustrer l’expérience de recherche et la qualité des demandes envoyées à l’agence.</p></section>
          <section className="detail-section"><p className="eyebrow">{t.equipment}</p><h2>Ce que le bien propose</h2><div className="amenities-grid">{amenities.map(([icon, label]) => <div key={label}>{icon}<span>{label}</span></div>)}{property.nearBeach && <div><Waves /><span>{t.nearBeach}</span></div>}{property.elevator && <div><Check /><span>{t.elevator}</span></div>}</div></section>
          <section className="detail-section"><p className="eyebrow">{t.area}</p><h2>{property.zone}, Mahdia</h2><div className="detail-map"><div className="detail-map-water" /><div className="detail-map-grid" /><span className="map-neighborhood">{property.zone}</span><span className="map-detail-pin"><MapPin fill="currentColor" /></span><div><MapPin size={15} />{t.approximateLocation}</div></div><p className="map-disclaimer">La zone indique le quartier à titre approximatif. L’adresse exacte n’est pas affichée sur cette fiche de démonstration.</p></section>
        </article>

        <aside className="lead-card">
          <p className="eyebrow">{t.directAgency}</p><h2>{t.interested}</h2><div className="lead-reference"><span>{t.propertySelected}</span><strong>{property.reference}</strong><p>{property.shortTitle}</p></div>
          <form onSubmit={submitLead}><label>{t.firstName}<input required placeholder="Votre prénom" value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} /></label><label>{t.phone}<input required inputMode="tel" placeholder="+216 XX XXX XXX" value={lead.phone} onChange={(event) => setLead({ ...lead, phone: event.target.value })} /></label><fieldset><legend>{t.preferredContact}</legend><div className="contact-choice"><label className={lead.contact === "WhatsApp" ? "selected" : ""}><input type="radio" name="contact" checked={lead.contact === "WhatsApp"} onChange={() => setLead({ ...lead, contact: "WhatsApp" })} /><MessageCircle />WhatsApp</label><label className={lead.contact === "Appel" ? "selected" : ""}><input type="radio" name="contact" checked={lead.contact === "Appel"} onChange={() => setLead({ ...lead, contact: "Appel" })} /><Phone />{t.call}</label></div></fieldset><button className="button button-accent button-full" type="button" onClick={() => setVisitOpen(true)}><CalendarDays size={18} />{t.requestVisit}</button><button className="button button-whatsapp button-full" type="submit"><MessageCircle size={18} />WhatsApp</button></form><small>Votre demande inclura automatiquement la référence <b>{property.reference}</b>.</small>
        </aside>
      </div>

      <section className="related-section section"><div className="container"><div className="section-heading heading-row"><div><p className="eyebrow">À découvrir aussi</p><h2>Des biens dans le même esprit.</h2></div><a href="/properties" className="text-link">Tous les biens <ChevronRight size={17} /></a></div><div className="listing-grid related-grid">{related.map((item) => <PropertyCard key={item.reference} property={item} compact />)}</div></div></section>

      <div className="mobile-detail-cta"><div><span>{property.reference}</span><strong>{formatPrice(property)}</strong></div><button type="button" onClick={() => setVisitOpen(true)}>{t.requestVisit}</button></div>

      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Galerie ${property.title}`}><button className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Fermer" type="button"><X /></button><button className="lightbox-nav prev" onClick={() => setActiveImage((activeImage - 1 + property.images.length) % property.images.length)} aria-label="Image précédente" type="button"><ChevronLeft /></button><img src={property.images[activeImage]} alt={`${property.title} — vue agrandie ${activeImage + 1}`} /><button className="lightbox-nav next" onClick={() => setActiveImage((activeImage + 1) % property.images.length)} aria-label="Image suivante" type="button"><ChevronRight /></button><span>{activeImage + 1} / {property.images.length}</span></div>}
      {visitOpen && <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="visit-title"><form className="simple-modal visit-modal" onSubmit={submitVisit}><button className="modal-close" onClick={() => setVisitOpen(false)} aria-label={t.close} type="button"><X /></button><p className="eyebrow">{t.scheduleVisit}</p><h2 id="visit-title">{t.chooseMoment}</h2><p className="modal-property">{property.reference} — {property.shortTitle}</p><label>{t.desiredDate}<input required type="date" value={visit.date} onInput={(event) => setVisit({ ...visit, date: event.currentTarget.value })} /></label><fieldset><legend>Moment</legend><div className="moment-choice">{[["Matin", t.morning], ["Après-midi", t.afternoon], ["Soir", t.evening]].map(([moment, label]) => <button className={visit.moment === moment ? "active" : ""} onClick={() => setVisit({ ...visit, moment })} type="button" key={moment}>{label}</button>)}</div></fieldset><div className="form-row two"><label>{t.fullName}<input required placeholder="Ahmed" value={visit.name} onChange={(event) => setVisit({ ...visit, name: event.target.value })} /></label><label>{t.phone}<input required inputMode="tel" placeholder="+216 XX XXX XXX" value={visit.phone} onChange={(event) => setVisit({ ...visit, phone: event.target.value })} /></label></div><label>{t.optionalMessage}<textarea rows={3} value={visit.note} onChange={(event) => setVisit({ ...visit, note: event.target.value })} placeholder="Une précision pour l’agence…" /></label><button className="button button-whatsapp button-full" type="submit"><MessageCircle size={18} />{t.previewRequest}</button></form></div>}
      {preview && <MessagePreview message={preview.message} url={preview.url} onClose={() => setPreview(null)} />}
    </main>
  );
}
