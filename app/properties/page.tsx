import { PropertyExplorer } from "../../components/property-explorer";

export const metadata = {
  title: "Biens à louer, vendre et locations vacances | LOCAM Mahdia",
  description: "Explorez les biens de démonstration LOCAM à Mahdia et filtrez par transaction, zone, budget et caractéristiques.",
};

export default function PropertiesPage() {
  return <PropertyExplorer />;
}
