"use client";

import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "../data/properties";
import { formatPrice } from "../data/properties";
import { useFavorites, useLocale } from "./providers";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLocale();
  const favorite = isFavorite(property.reference);
  const features = [property.seaView && t.seaView, property.furnished && t.furnished, property.airConditioning && t.airConditioning, property.nearBeach && t.nearBeach, property.parking && t.parking, property.terrace && t.terrace].filter(Boolean).slice(0, 3);
  const badge = property.transactionType === "rent" ? t.rent : property.transactionType === "sale" ? t.sale : t.vacation;
  const price = property.price === null ? t.priceOnRequest : formatPrice(property).replace("/ mois", t.perMonth);

  return (
    <article className={`property-card ${compact ? "compact" : ""}`} data-reference={property.reference}>
      <div className="card-image-wrap">
        <a href={`/properties/${property.reference}`} aria-label={`Voir ${property.title}`}><img src={property.images[0]} alt={`${property.title}, ${property.location}`} /></a>
        <span className={`property-badge ${property.transactionType}`}>{badge}</span>
        <button className={`favorite-button ${favorite ? "active" : ""}`} onClick={() => toggleFavorite(property.reference)} aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"} type="button"><Heart size={19} fill={favorite ? "currentColor" : "none"} /></button>
      </div>
      <div className="card-body">
        <div className="card-reference">{property.reference}<span>{property.available ? t.available : t.priceOnRequest}</span></div>
        <h3><a href={`/properties/${property.reference}`}>{property.shortTitle}</a></h3>
        <p className="card-location"><MapPin size={14} />{property.location}</p>
        <div className="card-specs">
          <span><Maximize2 size={15} />{property.surface} m²</span>
          {property.bedrooms > 0 && <span><BedDouble size={16} />{property.bedrooms} {t.bedrooms}</span>}
          {property.bathrooms > 0 && <span><Bath size={15} />{property.bathrooms} {t.bathroom}</span>}
        </div>
        <div className="card-features">{features.map((feature) => <span key={String(feature)}>{feature}</span>)}</div>
        <div className="card-footer"><strong>{price}</strong><a href={`/properties/${property.reference}`}>{t.view}<span>↗</span></a></div>
      </div>
    </article>
  );
}
