"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Building2, CalendarDays, Check, ChevronDown, Compass, Home, KeyRound, MapPin, MessageCircle, Phone, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { properties, type Property } from "../data/properties";
import { createWhatsAppUrl, requirementMessage, vacationMessage } from "../lib/whatsapp";
import { useLocale } from "./providers";
import { PropertyCard } from "./property-card";
import { MessagePreview } from "./message-preview";

const zones = ["Mahdia", "Zone Touristique", "Hiboun", "Rejiche", "Sidi Massoud"];
const rooms = ["Studio", "S+1", "S+2", "S+3", "S+4+"];
const criteriaOptions = ["Vue mer", "Proche plage", "Parking", "Ascenseur", "Terrasse", "Climatisation"];

export function HomeClient() {
  const { t } = useLocale();
  const [transaction, setTransaction] = useState<"rent" | "sale" | "vacation">("rent");
  const [heroSearch, setHeroSearch] = useState({ type: "Appartement", zone: "Zone Touristique", min: "800", max: "1300", rooms: "S+2" });
  const [listingMode, setListingMode] = useState<"all" | "rent" | "sale" | "vacation">("all");
  const [listingZone, setListingZone] = useState("all");
  const [vacationProperty, setVacationProperty] = useState<Property | null>(null);
  const [vacationValues, setVacationValues] = useState({ arrival: "", departure: "", guests: "4" });
  const [preview, setPreview] = useState<{ message: string; url: string } | null>(null);
  const [requirement, setRequirement] = useState<Record<string, string>>({ intent: "Location", type: "Appartement", rooms: "S+2", minBudget: "800", maxBudget: "1200", furnished: "Oui", date: "Septembre 2026", name: "", phone: "" });
  const [selectedZones, setSelectedZones] = useState(["Zone Touristique", "Mahdia"]);
  const [criteria, setCriteria] = useState(["Vue mer", "Climatisation", "Proche plage"]);

  const visibleProperties = useMemo(() => properties.filter((property) => (listingMode === "all" || property.transactionType === listingMode) && (listingZone === "all" || property.zone === listingZone)).slice(0, 6), [listingMode, listingZone]);
  const vacationProperties = properties.filter((property) => property.transactionType === "vacation").slice(0, 3);
  const propertyTypeOptions = [["Appartement", t.apartment], ["Maison", t.house], ["Villa", t.villa], ["Terrain", t.land], ["Local commercial", t.commercial]];
  const zoneOptions = zones.map((zone) => [zone, zone === "Zone Touristique" ? t.touristZone : zone]);
  const criteriaLabels: Record<string, string> = { "Vue mer": t.seaView, "Proche plage": t.nearBeach, Parking: t.parking, Ascenseur: t.elevator, Terrasse: t.terrace, Climatisation: t.airConditioning };

  function submitHero(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams({ transaction, type: heroSearch.type, zone: heroSearch.zone, min: heroSearch.min, max: heroSearch.max, rooms: heroSearch.rooms });
    window.location.href = `/properties?${query.toString()}`;
  }

  function submitRequirement(event: React.FormEvent) {
    event.preventDefault();
    const message = requirementMessage(requirement, selectedZones, criteria);
    setPreview({ message, url: createWhatsAppUrl({ message }) });
  }

  function submitVacation(event: React.FormEvent) {
    event.preventDefault();
    if (!vacationProperty) return;
    const message = vacationMessage(vacationProperty, vacationValues);
    setVacationProperty(null);
    setPreview({ message, url: createWhatsAppUrl({ message }) });
  }

  const toggle = (value: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  return (
    <main>
      <section className="hero" id="accueil">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow light">{t.realEstateMahdia}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-lead">{t.heroSubtitle}</p>

          <form className="hero-search" onSubmit={submitHero}>
            <div className="intent-tabs" role="tablist" aria-label="Type de transaction">
              {(["rent", "sale", "vacation"] as const).map((item) => <button key={item} className={transaction === item ? "active" : ""} onClick={() => setTransaction(item)} type="button" role="tab" aria-selected={transaction === item}>{item === "rent" ? t.rental.toUpperCase() : item === "sale" ? t.buy.toUpperCase() : t.vacation.toUpperCase()}</button>)}
            </div>
            <div className="search-grid">
              <label><span>{t.type}</span><select value={heroSearch.type} onChange={(event) => setHeroSearch({ ...heroSearch, type: event.target.value })}>{propertyTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown /></label>
              <label><span>{t.zone}</span><select value={heroSearch.zone} onChange={(event) => setHeroSearch({ ...heroSearch, zone: event.target.value })}>{zoneOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}<option value="Autre">{t.other}</option></select><ChevronDown /></label>
              <label className="budget-field"><span>{t.budget}</span><div><input aria-label={t.minBudget} inputMode="numeric" value={heroSearch.min} onChange={(event) => setHeroSearch({ ...heroSearch, min: event.target.value })} /><b>—</b><input aria-label={t.maxBudget} inputMode="numeric" value={heroSearch.max} onChange={(event) => setHeroSearch({ ...heroSearch, max: event.target.value })} /><em>DT</em></div></label>
              <label><span>{t.configuration}</span><select value={heroSearch.rooms} onChange={(event) => setHeroSearch({ ...heroSearch, rooms: event.target.value })}>{rooms.map((room) => <option key={room}>{room}</option>)}</select><ChevronDown /></label>
              <button className="search-submit" type="submit"><Search size={19} />{t.search}</button>
            </div>
          </form>
        </div>
        <div className="hero-caption"><span>MAHDIA</span><p>{t.mediterraneanTunisia}</p></div>
      </section>

      <section className="category-section section container">
        <div className="section-heading split-heading"><div><p className="eyebrow">{t.searchThreeWays}</p><h2>{t.projectMahdia}</h2></div><p>{t.projectIntro}</p></div>
        <div className="category-grid">
          <CategoryCard title={t.rent} text={t.rentCard} discover={t.discover} href="/properties?transaction=rent" image={properties[0].images[0]} index="01" />
          <CategoryCard title={t.buy} text={t.buyCard} discover={t.discover} href="/properties?transaction=sale" image={properties[2].images[0]} index="02" />
          <CategoryCard title={t.vacation} text={t.vacationCard} discover={t.discover} href="/properties?transaction=vacation" image={properties[3].images[0]} index="03" />
        </div>
      </section>

      <section className="featured-section section" id="biens">
        <div className="container">
          <div className="section-heading heading-row"><div><p className="eyebrow">{t.locamSelection}</p><h2>{t.featured}</h2></div><a className="text-link" href="/properties">{t.allProperties}<ArrowRight size={17} /></a></div>
          <div className="featured-grid">{properties.filter((property) => property.featured).slice(0, 4).map((property) => <PropertyCard key={property.reference} property={property} />)}</div>
          <p className="demo-note">{t.demoNote}</p>
        </div>
      </section>

      <section className="discovery-section section container">
        <div className="discovery-toolbar">
          <div><p className="eyebrow">{t.exploreMarket}</p><h2>{t.marketTitle}</h2></div>
          <div className="quick-filters" aria-label={t.quickFilters}>
            {(["all", "rent", "sale", "vacation"] as const).map((mode) => <button className={listingMode === mode ? "active" : ""} onClick={() => setListingMode(mode)} type="button" key={mode}>{mode === "all" ? t.all : mode === "rent" ? t.rental : mode === "sale" ? t.saleNoun : t.vacationRental}</button>)}
            <label><MapPin size={15} /><select aria-label={t.filterByZone} value={listingZone} onChange={(event) => setListingZone(event.target.value)}><option value="all">{t.allZones}</option>{zoneOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
        </div>
          <div className="result-count"><strong>{visibleProperties.length}</strong> {t.matching} <a href="/properties"><SlidersHorizontal size={15} />{t.advancedFilters}</a></div>
        <div className="listing-grid">{visibleProperties.map((property) => <PropertyCard key={property.reference} property={property} compact />)}</div>
      </section>

      <section className="requirement-section section" id="recherche">
        <div className="requirement-intro">
          <div><p className="eyebrow light">{t.personalSearch}</p><h2>{t.noRightProperty}</h2><p>{t.personalSearchIntro}</p></div>
          <div className="requirement-value"><span><Sparkles size={20} /></span><p>{t.personalSearchWhatsApp}</p></div>
        </div>
        <form className="requirement-form" onSubmit={submitRequirement}>
          <div className="form-section"><span className="form-number">01</span><div className="form-section-body"><h3>{t.yourSearch}</h3><div className="form-row three">
            <label>{t.iAmLooking}<select value={requirement.intent} onChange={(event) => setRequirement({ ...requirement, intent: event.target.value })}><option value="Location">{t.rental}</option><option value="Achat">{t.buy}</option><option value="Location vacances">{t.vacationRental}</option></select></label>
            <label>{t.type}<select value={requirement.type} onChange={(event) => setRequirement({ ...requirement, type: event.target.value })}>{propertyTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>{t.configuration}<select value={requirement.rooms} onChange={(event) => setRequirement({ ...requirement, rooms: event.target.value })}>{rooms.map((room) => <option key={room}>{room}</option>)}</select></label>
          </div><fieldset><legend>{t.preferredArea}</legend><div className="chip-row">{zoneOptions.map(([zone, label]) => <button key={zone} className={selectedZones.includes(zone) ? "selected" : ""} onClick={() => toggle(zone, selectedZones, setSelectedZones)} type="button">{selectedZones.includes(zone) && <Check size={14} />}{label}</button>)}</div></fieldset></div></div>
          <div className="form-section"><span className="form-number">02</span><div className="form-section-body"><h3>{t.criteria}</h3><div className="form-row three">
            <label>{t.minBudget}<input inputMode="numeric" value={requirement.minBudget} onChange={(event) => setRequirement({ ...requirement, minBudget: event.target.value })} /><i>DT</i></label>
            <label>{t.maxBudget}<input inputMode="numeric" value={requirement.maxBudget} onChange={(event) => setRequirement({ ...requirement, maxBudget: event.target.value })} /><i>DT</i></label>
            <label>{t.furnished}<select value={requirement.furnished} onChange={(event) => setRequirement({ ...requirement, furnished: event.target.value })}><option>{t.yes}</option><option>{t.no}</option><option>{t.any}</option></select></label>
          </div><fieldset><legend>{t.importantToMe}</legend><div className="chip-row">{criteriaOptions.map((item) => <button key={item} className={criteria.includes(item) ? "selected" : ""} onClick={() => toggle(item, criteria, setCriteria)} type="button">{criteria.includes(item) && <Check size={14} />}{criteriaLabels[item]}</button>)}</div></fieldset></div></div>
          <div className="form-section"><span className="form-number">03</span><div className="form-section-body"><h3>{t.whenContact}</h3><div className="form-row three">
            <label>{t.desiredDate}<input placeholder="Ex. Septembre 2026" value={requirement.date} onChange={(event) => setRequirement({ ...requirement, date: event.target.value })} /></label>
            <label>{t.fullName}<input required placeholder="Ahmed Ben Salah" value={requirement.name} onChange={(event) => setRequirement({ ...requirement, name: event.target.value })} /></label>
            <label>{t.phone}<input required inputMode="tel" placeholder="+216 XX XXX XXX" value={requirement.phone} onChange={(event) => setRequirement({ ...requirement, phone: event.target.value })} /></label>
          </div><button className="button button-accent requirement-submit" type="submit">{t.findProperty}<MessageCircle size={18} /></button></div></div>
        </form>
      </section>

      <section className="vacation-section section">
        <div className="container">
          <div className="section-heading split-heading"><div><p className="eyebrow light">{t.seasideStays}</p><h2>{t.holidayRentalsMahdia}</h2></div><p>{t.holidayIntro}</p></div>
          <div className="vacation-grid">{vacationProperties.map((property, index) => <article className={`vacation-card ${index === 0 ? "large" : ""}`} key={property.reference}><img src={property.images[index % property.images.length]} alt={`${property.title} — ${property.location}`} /><div className="vacation-shade" /><div className="vacation-copy"><span>{property.reference} · {property.zone}</span><h3>{property.shortTitle}</h3><div>{property.guests} {t.travelers} · {property.bedrooms} {t.roomsWord} · {t.airConditioned} · {t.nearBeach}</div><strong>{t.priceOnRequest}</strong><button onClick={() => setVacationProperty(property)} type="button">{t.checkAvailability}<CalendarDays size={17} /></button></div></article>)}</div>
        </div>
      </section>

      <section className="owner-banner">
        <div className="owner-image" />
        <div className="owner-content"><p className="eyebrow">{t.ownersSide}</p><h2>{t.ownerQuestion}</h2><p>{t.ownerIntro}</p><a className="button button-dark" href="/proposer">{t.proposeProperty}<ArrowRight size={18} /></a></div>
      </section>

      <section className="why-section section container">
        <div className="section-heading split-heading"><div><p className="eyebrow">{t.usefulExperience}</p><h2>{t.fewerBackAndForth}</h2></div><p>{t.usefulIntro}</p></div>
        <div className="why-grid">
          <Value icon={<Search />} number="01" title={t.simpleSearch} text={t.simpleSearchText} />
          <Value icon={<MessageCircle />} number="02" title={t.directContactValue} text={t.directContactText} />
          <Value icon={<Compass />} number="03" title={t.agencyMahdiaValue} text={t.agencyMahdiaText} />
          <Value icon={<CalendarDays />} number="04" title={t.simplifiedVisits} text={t.simplifiedVisitsText} />
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy"><p className="eyebrow light">{t.agencyLocal}</p><h2>{t.realEstateAgency}<br />LOCAM Mahdia</h2><div className="contact-address"><MapPin /><p>255 Avenue Habib Bourguiba<br />Mahdia, Tunisie</p></div><div className="contact-actions"><a className="button button-light" href="tel:+21658023092"><Phone size={18} />{t.call}</a><a className="button button-whatsapp" target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message: "Bonjour LOCAM 👋\n\nJe souhaite échanger avec votre agence à Mahdia." })}><MessageCircle size={18} />{t.whatsapp}</a><a className="text-link light" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Agence%20immobili%C3%A8re%20Locam%20mahdia%20Mahdia%20Tunisia">{t.route}<ArrowRight size={17} /></a></div></div>
        <div className="map-panel"><iframe title={`${t.realEstateAgency} LOCAM Mahdia`} loading="lazy" src="https://www.google.com/maps?q=255%20Avenue%20Habib%20Bourguiba%2C%20Mahdia%2C%20Tunisia&output=embed" /><div className="map-label"><span>LOCAM</span><p>255 Av. Habib Bourguiba</p></div></div>
      </section>

      <a className="mobile-whatsapp" target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message: "Bonjour LOCAM 👋\n\nJe souhaite rechercher un bien à Mahdia." })}><MessageCircle size={20} />{t.talkToLocam}</a>

      {vacationProperty && <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="vacation-title"><form className="simple-modal" onSubmit={submitVacation}><button className="modal-close" onClick={() => setVacationProperty(null)} aria-label={t.close} type="button"><X /></button><p className="eyebrow">{t.vacationAvailability}</p><h2 id="vacation-title">{t.prepareStay}</h2><p className="modal-property">{vacationProperty.reference} — {vacationProperty.shortTitle}</p><div className="form-row two"><label>{t.arrival}<input required type="date" value={vacationValues.arrival} onInput={(event) => setVacationValues({ ...vacationValues, arrival: event.currentTarget.value })} /></label><label>{t.departure}<input required type="date" value={vacationValues.departure} onInput={(event) => setVacationValues({ ...vacationValues, departure: event.currentTarget.value })} /></label></div><label>{t.guests}<select value={vacationValues.guests} onChange={(event) => setVacationValues({ ...vacationValues, guests: event.target.value })}>{[1,2,3,4,5,6,7,8].map((count) => <option key={count}>{count}</option>)}</select></label><button className="button button-whatsapp button-full" type="submit"><MessageCircle size={18} />{t.previewRequest}</button></form></div>}
      {preview && <MessagePreview message={preview.message} url={preview.url} onClose={() => setPreview(null)} />}
    </main>
  );
}

function CategoryCard({ title, text, discover, href, image, index }: { title: string; text: string; discover: string; href: string; image: string; index: string }) {
  return <a className="category-card" href={href}><img src={image} alt="" /><div className="category-shade" /><span>{index}</span><div><h3>{title}</h3><p>{text}</p><b>{discover} <ArrowRight size={17} /></b></div></a>;
}

function Value({ icon, number, title, text }: { icon: React.ReactNode; number: string; title: string; text: string }) {
  return <article className="value-card"><div><span>{icon}</span><b>{number}</b></div><h3>{title}</h3><p>{text}</p></article>;
}
