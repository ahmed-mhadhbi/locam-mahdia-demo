import { MessageCircle, Phone } from "lucide-react";
import { createWhatsAppUrl } from "../lib/whatsapp";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><strong>LOCAM</strong><span>IMMOBILIER • MAHDIA</span><p>Votre recherche immobilière, connectée directement à une agence locale.</p></div>
        <div className="footer-links"><span>Explorer</span><a href="/properties?transaction=rent">À louer</a><a href="/properties?transaction=sale">À vendre</a><a href="/properties?transaction=vacation">Vacances</a><a href="/properties">Nos biens</a></div>
        <div className="footer-links"><span>Votre projet</span><a href="/proposer">Proposer un bien</a><a href="/#recherche">Décrire ma recherche</a><a href="/favorites">Mes favoris</a><a href="/#contact">Contact</a></div>
        <div className="footer-contact"><span>Contact direct</span><a href="tel:+21658023092"><Phone size={16} /> +216 58 023 092</a><a target="_blank" rel="noreferrer" href={createWhatsAppUrl({ message: "Bonjour LOCAM 👋\n\nJe souhaite échanger avec votre agence à Mahdia." })}><MessageCircle size={16} /> WhatsApp</a><p>255 Avenue Habib Bourguiba<br />Mahdia, Tunisie</p></div>
      </div>
      <div className="footer-bottom"><p>Certains biens, tarifs et disponibilités affichés sont utilisés à titre de démonstration.</p><p>Prototype digital réalisé pour démonstration.</p></div>
    </footer>
  );
}
