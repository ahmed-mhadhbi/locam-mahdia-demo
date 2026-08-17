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
  const { locale, t } = useLocale();
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

  useEffect(() => {
    if (!drawer) return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
    };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawer]);

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
  const numberLocale = locale === "ar" ? "ar-TN" : locale === "en" ? "en-US" : "fr-FR";
  const propertyTypeOptions = [
    ["all", t.allTypes], ["Appartement", t.apartment], ["Maison", t.house], ["Villa", t.villa], ["Terrain", t.land], ["Local commercial", t.commercial],
  ];
  const zoneOptions = [["all", t.allZones], ["Mahdia", "Mahdia"], ["Zone Touristique", t.touristZone], ["Hiboun", "Hiboun"], ["Rejiche", "Rejiche"], ["Sidi Massoud", "Sidi Massoud"]];

  return (
    <main className="explorer-page">
      <section className="explorer-hero"><div className="container"><p className="eyebrow light">{t.collectionDemo}</p><h1>{t.explorerTitle}</h1><p>{t.explorerSubtitle}</p></div></section>
      <div className="mobile-filter-bar">
        <button className="mobile-filter-trigger" type="button" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="property-filters">
          <span className="mobile-filter-icon"><ListFilter size={19} /></span><span className="mobile-filter-copy"><small>{t.refineSearch}</small><strong>{t.filters}</strong></span>{activeCount > 0 && <b>{activeCount}</b>}
        </button>
        <button className="mobile-view-trigger" type="button" onClick={() => setMapOpen(!mapOpen)} aria-label={t.viewMode} aria-pressed={mapOpen}>
          <span className="mobile-filter-icon"><Map size={19} /></span><span className="mobile-filter-copy"><small>{t.viewMode}</small><strong>{mapOpen ? t.list : t.map}</strong></span>
        </button>
      </div>
      <div className={`explorer-layout container ${mapOpen ? "show-map" : ""}`}>
        <aside id="property-filters" className={`filters-panel ${drawer ? "drawer-open" : ""}`} aria-hidden={!drawer && undefined}>
          <div className="filter-header"><div><SlidersHorizontal size={20} /><span><h2>{t.filters}</h2><p>{activeCount > 0 ? `${activeCount} ${t.activeFilters}` : t.filterSubtitle}</p></span></div><button onClick={() => setDrawer(false)} type="button" aria-label={t.closeFilters}><X /></button></div>
          <div className="filter-scroll">
            <FilterSelect label={t.transaction} value={filters.transaction} onChange={(value) => set("transaction", value as Filters["transaction"])} options={[["all", t.all], ["rent", t.rental], ["sale", t.saleNoun], ["vacation", t.vacationRental]]} />
            <FilterSelect label={t.type} value={filters.type} onChange={(value) => set("type", value)} options={propertyTypeOptions} />
            <FilterSelect label={t.zone} value={filters.zone} onChange={(value) => set("zone", value)} options={zoneOptions} />
            <FilterSelect label={t.configuration} value={filters.rooms} onChange={(value) => set("rooms", value)} options={[["all", t.allConfigurations], ...["Studio", "S+1", "S+2", "S+3", "S+4+"].map((item) => [item, item])]} />
            <div className="filter-group budget-filter"><h3>{t.budget}</h3><div className="budget-inputs"><label>{t.min}<input inputMode="numeric" value={filters.min} onChange={(event) => set("min", Math.max(0, Number(event.target.value)))} /></label><span>—</span><label>{t.max}<input inputMode="numeric" value={filters.max} onChange={(event) => set("max", Math.max(filters.min, Number(event.target.value)))} /></label></div><div className="range-wrap"><input aria-label={t.minBudget} type="range" min="0" max="500000" step="500" value={filters.min} onChange={(event) => set("min", Math.min(Number(event.target.value), filters.max))} /><input aria-label={t.maxBudget} type="range" min="0" max="500000" step="500" value={filters.max} onChange={(event) => set("max", Math.max(Number(event.target.value), filters.min))} /></div><p>{new Intl.NumberFormat(numberLocale).format(filters.min)} — {new Intl.NumberFormat(numberLocale).format(filters.max)} DT</p></div>
            <div className="filter-group"><h3>{t.features}</h3><div className="feature-checks">{featureLabels.map(([key]) => { const label = t[key as keyof typeof t] as string; return <label key={key}><input type="checkbox" checked={Boolean(filters[key])} onChange={(event) => set(key, event.target.checked as never)} /><span><Check size={13} /></span>{label}</label>; })}</div></div>
          </div>
          <div className="filter-footer">
            <button className="reset-filters" type="button" onClick={() => setFilters(initial)}><RotateCcw size={15} />{t.reset}</button>
            <button className="button button-accent mobile-apply" type="button" onClick={() => setDrawer(false)}>{t.showProperties} ({filtered.length})</button>
          </div>
        </aside>
        {drawer && <button className="filter-scrim" onClick={() => setDrawer(false)} aria-label={t.closeFilters} type="button" />}

        <section className="explorer-results">
          <div className="results-toolbar"><div><strong>{filtered.length}</strong><span>{t.matching}</span></div><label>{t.sortBy}<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">{t.recommended}</option><option value="price-asc">{t.priceAsc}</option><option value="price-desc">{t.priceDesc}</option><option value="newest">{t.newest}</option></select><ChevronDown size={15} /></label></div>
          {filtered.length ? <div className="explorer-grid">{filtered.map((property) => <PropertyCard key={property.reference} property={property} compact />)}</div> : <div className="empty-results"><MapPin /><h2>{t.noExactMatch}</h2><p>{t.widenCriteria}</p><a className="button button-dark" href="/#recherche">{t.describeSearch}</a></div>}
        </section>

        <aside className="property-map">
          <div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><span className="sea-label">{t.mediterraneanSea}</span><span className="district d1">{t.touristZone}</span><span className="district d2">MAHDIA</span><span className="district d3">HIBOUN</span><span className="district d4">REJICHE</span>
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
