export type TransactionType = "rent" | "sale" | "vacation";
export type PropertyType = "Appartement" | "Maison" | "Villa" | "Terrain" | "Local commercial";

export type Property = {
  id: number;
  reference: string;
  title: string;
  shortTitle: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  location: string;
  zone: string;
  price: number | null;
  pricePeriod?: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  roomsLabel: string;
  furnished: boolean;
  airConditioning: boolean;
  parking: boolean;
  elevator: boolean;
  terrace: boolean;
  seaView: boolean;
  nearBeach: boolean;
  guests?: number;
  images: string[];
  description: string;
  featured: boolean;
  available: boolean;
  addedAt: string;
  latitude: number;
  longitude: number;
};

const image = (id: string, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`;

const galleries = {
  coast: [
    image("photo-1600566753190-17f0baa2a6c3"),
    image("photo-1600607687920-4e2a09cf159d"),
    image("photo-1600210492486-724fe5c67fb0"),
  ],
  bright: [
    image("photo-1493809842364-78817add7ffb"),
    image("photo-1560448204-e02f11c3d0e2"),
    image("photo-1605146769289-440113cc3d00"),
  ],
  villa: [
    image("photo-1600585154340-be6161a56a0c"),
    image("photo-1600607687939-ce8a6c25118c"),
    image("photo-1600047509807-ba8f99d2cdde"),
  ],
  warm: [
    image("photo-1615874959474-d609969a20ed"),
    image("photo-1613490493576-7fde63acd811"),
    image("photo-1618221195710-dd6b41faaea6"),
  ],
  modern: [
    image("photo-1605146769289-440113cc3d00"),
    image("photo-1600607688969-a5bfcd646154"),
    image("photo-1600047509782-20d39509f26d"),
  ],
  land: [
    image("photo-1500530855697-b586d89ba3ee"),
    image("photo-1500382017468-9049fed747ef"),
    image("photo-1473448912268-2022ce9509d8"),
  ],
  commercial: [
    image("photo-1497366754035-f200968a6e72"),
    image("photo-1497215728101-856f4ea42174"),
    image("photo-1524758631624-e2822e304c36"),
  ],
};

export const properties: Property[] = [
  {
    id: 101, reference: "LOC-101", title: "Appartement S+2 Vue Mer", shortTitle: "S+2 Vue Mer",
    transactionType: "rent", propertyType: "Appartement", location: "Zone Touristique, Mahdia", zone: "Zone Touristique",
    price: 1200, pricePeriod: "/ mois", surface: 95, bedrooms: 2, bathrooms: 1, roomsLabel: "S+2",
    furnished: true, airConditioning: true, parking: false, elevator: true, terrace: true, seaView: true, nearBeach: true,
    images: galleries.coast, description: "Un appartement lumineux pensé pour profiter pleinement de la côte de Mahdia. Le séjour s’ouvre sur une terrasse avec vue mer, la cuisine est fonctionnelle et les deux chambres offrent un cadre calme pour une installation à l’année.",
    featured: true, available: true, addedAt: "2026-08-12", latitude: 35.5227, longitude: 11.0531,
  },
  {
    id: 102, reference: "LOC-102", title: "Appartement S+1 proche plage", shortTitle: "S+1 proche plage",
    transactionType: "rent", propertyType: "Appartement", location: "Mahdia", zone: "Mahdia", price: 850, pricePeriod: "/ mois",
    surface: 62, bedrooms: 1, bathrooms: 1, roomsLabel: "S+1", furnished: true, airConditioning: true, parking: false, elevator: false, terrace: false, seaView: false, nearBeach: true,
    images: galleries.bright, description: "Un pied-à-terre soigné à quelques minutes de la plage et des services du centre. L’espace de vie est ouvert, agréable et facile à entretenir.", featured: true, available: true, addedAt: "2026-08-08", latitude: 35.5069, longitude: 11.0622,
  },
  {
    id: 103, reference: "LOC-103", title: "Villa familiale avec terrasse", shortTitle: "Villa familiale",
    transactionType: "sale", propertyType: "Villa", location: "Hiboun, Mahdia", zone: "Hiboun", price: null,
    surface: 240, bedrooms: 4, bathrooms: 3, roomsLabel: "S+4+", furnished: false, airConditioning: true, parking: true, elevator: false, terrace: true, seaView: false, nearBeach: false,
    images: galleries.villa, description: "Une villa aux volumes généreux, organisée autour d’un séjour traversant et d’une grande terrasse. Le jardin et le stationnement privatif en font une option adaptée à la vie de famille.", featured: true, available: true, addedAt: "2026-08-10", latitude: 35.5001, longitude: 11.0451,
  },
  {
    id: 104, reference: "LOC-104", title: "Appartement S+2 — Location vacances", shortTitle: "S+2 vacances",
    transactionType: "vacation", propertyType: "Appartement", location: "Zone Touristique, Mahdia", zone: "Zone Touristique", price: null,
    surface: 88, bedrooms: 2, bathrooms: 1, roomsLabel: "S+2", furnished: true, airConditioning: true, parking: true, elevator: true, terrace: true, seaView: true, nearBeach: true, guests: 5,
    images: galleries.warm, description: "Une adresse confortable pour séjourner près de la mer. L’appartement accueille jusqu’à cinq voyageurs et dispose d’une terrasse idéale au retour de la plage.", featured: true, available: true, addedAt: "2026-08-14", latitude: 35.5261, longitude: 11.0522,
  },
  {
    id: 105, reference: "LOC-105", title: "Terrain résidentiel bien situé", shortTitle: "Terrain résidentiel",
    transactionType: "sale", propertyType: "Terrain", location: "Mahdia", zone: "Mahdia", price: 285000, surface: 420, bedrooms: 0, bathrooms: 0, roomsLabel: "Terrain",
    furnished: false, airConditioning: false, parking: false, elevator: false, terrace: false, seaView: false, nearBeach: false,
    images: galleries.land, description: "Parcelle résidentielle de démonstration située dans un secteur accessible de Mahdia. La localisation affichée reste volontairement approximative.", featured: false, available: true, addedAt: "2026-07-29", latitude: 35.5104, longitude: 11.0478,
  },
  {
    id: 106, reference: "LOC-106", title: "Appartement S+3 avec parking", shortTitle: "S+3 avec parking",
    transactionType: "rent", propertyType: "Appartement", location: "Hiboun, Mahdia", zone: "Hiboun", price: 1450, pricePeriod: "/ mois", surface: 128, bedrooms: 3, bathrooms: 2, roomsLabel: "S+3",
    furnished: false, airConditioning: true, parking: true, elevator: true, terrace: true, seaView: false, nearBeach: false,
    images: galleries.modern, description: "Un appartement spacieux aux finitions contemporaines, avec une circulation fluide entre séjour, cuisine et terrasse. Place de stationnement incluse dans ce scénario de démonstration.", featured: true, available: true, addedAt: "2026-08-05", latitude: 35.4972, longitude: 11.047,
  },
  {
    id: 107, reference: "LOC-107", title: "Maison S+3 avec cour", shortTitle: "Maison avec cour",
    transactionType: "sale", propertyType: "Maison", location: "Rejiche", zone: "Rejiche", price: 395000, surface: 180, bedrooms: 3, bathrooms: 2, roomsLabel: "S+3",
    furnished: false, airConditioning: true, parking: true, elevator: false, terrace: true, seaView: false, nearBeach: true,
    images: galleries.villa, description: "Maison indépendante avec une cour agréable et des espaces adaptés à un quotidien familial. La plage et les commerces de Rejiche restent facilement accessibles.", featured: false, available: true, addedAt: "2026-07-21", latitude: 35.4685, longitude: 11.0442,
  },
  {
    id: 108, reference: "LOC-108", title: "Studio meublé central", shortTitle: "Studio meublé",
    transactionType: "rent", propertyType: "Appartement", location: "Mahdia", zone: "Mahdia", price: 620, pricePeriod: "/ mois", surface: 38, bedrooms: 0, bathrooms: 1, roomsLabel: "Studio",
    furnished: true, airConditioning: true, parking: false, elevator: true, terrace: false, seaView: false, nearBeach: false,
    images: galleries.bright, description: "Studio compact, lumineux et meublé pour une installation simple au centre de Mahdia. Les essentiels sont accessibles à pied.", featured: false, available: true, addedAt: "2026-08-01", latitude: 35.5053, longitude: 11.0574,
  },
  {
    id: 109, reference: "LOC-109", title: "Villa d’été proche mer", shortTitle: "Villa proche mer",
    transactionType: "vacation", propertyType: "Villa", location: "Rejiche", zone: "Rejiche", price: null, surface: 210, bedrooms: 4, bathrooms: 2, roomsLabel: "S+4+",
    furnished: true, airConditioning: true, parking: true, elevator: false, terrace: true, seaView: false, nearBeach: true, guests: 8,
    images: galleries.villa, description: "Une villa accueillante pour les séjours en famille ou entre amis, avec une grande terrasse et un accès pratique à la plage.", featured: true, available: true, addedAt: "2026-08-11", latitude: 35.465, longitude: 11.0475,
  },
  {
    id: 110, reference: "LOC-110", title: "Local commercial avenue passante", shortTitle: "Local commercial",
    transactionType: "rent", propertyType: "Local commercial", location: "Mahdia", zone: "Mahdia", price: 1800, pricePeriod: "/ mois", surface: 105, bedrooms: 0, bathrooms: 1, roomsLabel: "Open space",
    furnished: false, airConditioning: true, parking: false, elevator: false, terrace: false, seaView: false, nearBeach: false,
    images: galleries.commercial, description: "Local commercial de démonstration avec vitrine et espace principal modulable, dans un environnement passant de Mahdia.", featured: false, available: true, addedAt: "2026-07-18", latitude: 35.503, longitude: 11.0552,
  },
  {
    id: 111, reference: "LOC-111", title: "Appartement S+2 avec terrasse", shortTitle: "S+2 avec terrasse",
    transactionType: "sale", propertyType: "Appartement", location: "Sidi Massoud, Mahdia", zone: "Sidi Massoud", price: 330000, surface: 104, bedrooms: 2, bathrooms: 1, roomsLabel: "S+2",
    furnished: false, airConditioning: true, parking: true, elevator: true, terrace: true, seaView: false, nearBeach: true,
    images: galleries.coast, description: "Appartement bien distribué avec une terrasse qui prolonge le séjour. Une base équilibrée pour une résidence principale ou un pied-à-terre.", featured: false, available: true, addedAt: "2026-07-26", latitude: 35.516, longitude: 11.046,
  },
  {
    id: 112, reference: "LOC-112", title: "Appartement vacances face à la mer", shortTitle: "Séjour face à la mer",
    transactionType: "vacation", propertyType: "Appartement", location: "Zone Touristique, Mahdia", zone: "Zone Touristique", price: null, surface: 72, bedrooms: 1, bathrooms: 1, roomsLabel: "S+1",
    furnished: true, airConditioning: true, parking: false, elevator: true, terrace: true, seaView: true, nearBeach: true, guests: 3,
    images: galleries.warm, description: "Un appartement de vacances lumineux, avec une terrasse tournée vers la mer et tous les essentiels pour un séjour à deux ou en petite famille.", featured: false, available: true, addedAt: "2026-08-09", latitude: 35.5271, longitude: 11.0511,
  },
];

export const getProperty = (reference: string) => properties.find((property) => property.reference === reference);

export const formatPrice = (property: Property) =>
  property.price === null
    ? "Prix sur demande"
    : `${new Intl.NumberFormat("fr-FR").format(property.price).replace(/\u202f/g, " ")} DT${property.pricePeriod ? ` ${property.pricePeriod}` : ""}`;

export const transactionLabels: Record<TransactionType, string> = {
  rent: "Location",
  sale: "Vente",
  vacation: "Location vacances",
};

export const transactionBadges: Record<TransactionType, string> = {
  rent: "À louer",
  sale: "À vendre",
  vacation: "Vacances",
};
