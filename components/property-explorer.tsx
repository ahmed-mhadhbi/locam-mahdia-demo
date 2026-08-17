"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ListFilter, Map, MapPin, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { properties, type TransactionType } from "../data/properties";
import { PropertyCard } from "./property-card";
import { useLocale } from "./providers";

type Filters = {
  transaction: "all" | TransactionType;
  type: string;
  zone: string;
  rooms: string;
  min: number;
  max: number;
  furnished: boolean;
  airConditioning: boolean;
  seaView: boolean;
  nearBeach: boolean;
  parking: boolean;
  elevator: boolean;
  terrace: boolean;
};

const initial: Filters = { transaction: "all", type: "all", zone: "all", rooms: "all", min: 0, max: 500000, furnished: false, airConditioning: false, seaView: false, nearBeach: false, parking: false, elevator: false, terrace: false };
const featureLabels: [keyof Filters, string][] = [["furnished", "Meublé"], ["airConditioning", "Climatisation"], ["seaView", "Vue mer"], ["nearBeach", "Proche plage"], ["parking", "Parking"], ["elevator", "Ascenseur"], ["terrace", "Terrasse"]];

export function PropertyExplorer() {
  const { t } = useLocale();
  const [filters, setFilters] = useState<Filters>(initial);
  const [sort, setSort] = useState("recommended");
  const [drawer, setDrawer] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [activePin, setActivePin] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((current) => ({
      ...current,
      transaction: (["rent", "sale", "vacation"].includes(params.get("transaction") || "") ? params.get("transaction") : "all") as Filters["transaction"],
      type: params.get("type") || "all", zone: params.get("zone") || "all", rooms: params.get("rooms") || "all",
      min: Number(params.get("min")) || 0, max: Number(params.get("max")) || 500000,
    }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.transaction !== "all") params.set("transaction", filters.transaction);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.zone !== "all") params.set("zone", filters.zone);
    if (filters.rooms !== "all") params.set("rooms", filters.rooms);
    if (filters.min > 0) params.set("min", String(filters.min));
    if (filters.max < 500000) params.set("max", String(filters.max));
    const query = params.toString();
    window.history.replaceState({}, "", query ? `/properties?${query}` : "/properties");
  }, [filters]);

  const filtered = useMemo(() => {
    const items = properties.filter((property) => {
      const featureMatch = featureLabels.every(([key]) => !filters[key] || property[key as keyof typeof property] === true);
      return (filters.transaction === "all" || property.transactionType === filters.transaction)
        && (filters.type === "all" || property.propertyType === filters.type)
        && (filters.zone === "all" || property.zone === filters.zone)
        && (filters.rooms === "all" || property.roomsLabel === filters.rooms)
        && (property.price === null || (property.price >= filters.min && property.price <= filters.max))
        && featureMatch;
    });
    return [...items].sort((a, b) => {
      if (sort === "price-asc") return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (b.price ?? -1) - (a.price ?? -1);
      if (sort === "newest") return b.addedAt.localeCompare(a.addedAt);
      return Number(b.featured) - Number(a.featured);
    });
  }, [filters, sort]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((current) => ({ ...current, [key]: value }));
  const activeCount = Object.entries(filters).filter(([key, value]) => key !== "min" && key !== "max" ? value !== initial[key as keyof Filters] : value !== initial[key as keyof Filters]).length;

  return (
    <main className="explorer-page">
      <section className="explorer-hero"><div className="container"><p className="eyebrow light">Collection de démonstration</p><h1>Trouvez le bien qui vous ressemble.</h1><p>Explorez les locations, ventes et séjours disponibles autour de Mahdia.</p></div></section>
      <div className="mobile-filter-bar"><button type="button" onClick={() => setDrawer(true)}><ListFilter size={18} />{t.filters} {activeCount > 0 && <b>{activeCount}</b>}</button><button type="button" onClick={() => setMapOpen(!mapOpen)}><Map size={18} />{mapOpen ? "List" : "Map"}</button></div>
      <div className={`explorer-layout container ${mapOpen ? "show-map" : ""}`}>
        <aside className={`filters-panel ${drawer ? "drawer-open" : ""}`}>
          <div className="filter-header"><div><SlidersHorizontal size={19} /><h2>{t.filters}</h2></div><button onClick={() => setDrawer(false)} type="button" aria-label={t.close}><X /></button></div>
          <FilterSelect label={t.transaction} value={filters.transaction} onChange={(value) => set("transaction", value as Filters["transaction"])} options={[["all", t.all], ["rent", t.rental], ["sale", t.saleNoun], ["vacation", t.vacationRental]]} />
          <FilterSelect label={t.type} value={filters.type} onChange={(value) => set("type", value)} options={[["all", t.allTypes], ...["Appartement", "Maison", "Villa", "Terrain", "Local commercial"].map((item) => [item, item])]} />
          <FilterSelect label={t.zone} value={filters.zone} onChange={(value) => set("zone", value)} options={[["all", t.allZones], ...["Mahdia", "Zone Touristique", "Hiboun", "Rejiche", "Sidi Massoud"].map((item) => [item, item])]} />
          <FilterSelect label={t.configuration} value={filters.rooms} onChange={(value) => set("rooms", value)} options={[["all", t.allConfigurations], ...["Studio", "S+1", "S+2", "S+3", "S+4+"].map((item) => [item, item])]} />
          <div className="filter-group budget-filter"><h3>{t.budget}</h3><div className="budget-inputs"><label>{t.min}<input inputMode="numeric" value={filters.min} onChange={(event) => set("min", Math.max(0, Number(event.target.value)))} /></label><span>—</span><label>{t.max}<input inputMode="numeric" value={filters.max} onChange={(event) => set("max", Math.max(filters.min, Number(event.target.value)))} /></label></div><div className="range-wrap"><input aria-label={t.minBudget} type="range" min="0" max="500000" step="500" value={filters.min} onChange={(event) => set("min", Math.min(Number(event.target.value), filters.max))} /><input aria-label={t.maxBudget} type="range" min="0" max="500000" step="500" value={filters.max} onChange={(event) => set("max", Math.max(Number(event.target.value), filters.min))} /></div><p>{new Intl.NumberFormat("fr-FR").format(filters.min)} — {new Intl.NumberFormat("fr-FR").format(filters.max)} DT</p></div>
          <div className="filter-group"><h3>{t.features}</h3><div className="feature-checks">{featureLabels.map(([key]) => { const label = t[key as keyof typeof t] as string; return <label key={key}><input type="checkbox" checked={Boolean(filters[key])} onChange={(event) => set(key, event.target.checked as never)} /><span><Check size={13} /></span>{label}</label>; })}</div></div>
          <button className="reset-filters" type="button" onClick={() => setFilters(initial)}><RotateCcw size={15} />{t.reset}</button>
          <button className="button button-accent mobile-apply" type="button" onClick={() => setDrawer(false)}>{t.showProperties} ({filtered.length})</button>
        </aside>
        {drawer && <button className="filter-scrim" onClick={() => setDrawer(false)} aria-label="Fermer les filtres" type="button" />}

        <section className="explorer-results">
          <div className="results-toolbar"><div><strong>{filtered.length}</strong><span>{t.matching}</span></div><label>{t.sortBy}<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">{t.recommended}</option><option value="price-asc">{t.priceAsc}</option><option value="price-desc">{t.priceDesc}</option><option value="newest">{t.newest}</option></select><ChevronDown size={15} /></label></div>
          {filtered.length ? <div className="explorer-grid">{filtered.map((property) => <PropertyCard key={property.reference} property={property} compact />)}</div> : <div className="empty-results"><MapPin /><h2>Aucun bien ne correspond exactement</h2><p>Élargissez vos critères ou envoyez votre recherche à LOCAM.</p><a className="button button-dark" href="/#recherche">Décrire ma recherche</a></div>}
        </section>

        <aside className="property-map">
          <div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><span className="sea-label">MER MÉDITERRANÉE</span><span className="district d1">ZONE TOURISTIQUE</span><span className="district d2">MAHDIA</span><span className="district d3">HIBOUN</span><span className="district d4">REJICHE</span>
          {filtered.map((property, index) => <a className={`map-pin pin-${index % 8} ${activePin === property.reference ? "active" : ""}`} href={`/properties/${property.reference}`} key={property.reference} onMouseEnter={() => setActivePin(property.reference)} onMouseLeave={() => setActivePin(null)} aria-label={`${property.reference}, ${property.shortTitle}`}><MapPin fill="currentColor" /><span>{property.reference}</span></a>)}
          <div className="approx-label"><MapPin size={14} />{t.mapApprox}</div>
        </aside>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <div className="filter-group"><h3>{label}</h3><label className="filter-select"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([itemValue, itemLabel]) => <option key={itemValue} value={itemValue}>{itemLabel}</option>)}</select><ChevronDown size={16} /></label></div>;
}
