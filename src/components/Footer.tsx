import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="text-black" style={{ backgroundColor: "#F7F7F7" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-display font-bold tracking-tight">
              <span className="text-black">Ici</span>
              <span style={{ color: "rgb(61, 122, 95)" }}>Work</span>
            </Link>

            <p className="mt-3 text-sm text-black/60 leading-relaxed">
              La plateforme de référence pour trouver des prestataires de services à domicile qualifiés.
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-4 grid grid-cols-4 gap-2 w-full">
              <a
                href="https://www.linkedin.com/company/iciwork"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-full rounded-lg border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.instagram.com/iciwork"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-10 w-full rounded-lg border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/iciwork"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-10 w-full rounded-lg border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.youtube.com/@iciwork"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-10 w-full rounded-lg border border-black/20 hover:bg-black/5 transition-colors flex items-center justify-center"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li><Link to="/prestataires?cat=plomberie" className="hover:text-black transition-colors">Plomberie</Link></li>
              <li><Link to="/prestataires?cat=electricite" className="hover:text-black transition-colors">Électricité</Link></li>
              <li><Link to="/prestataires?cat=jardinage" className="hover:text-black transition-colors">Jardinage</Link></li>
              <li><Link to="/prestataires?cat=menage" className="hover:text-black transition-colors">Ménage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li><a href="#" className="hover:text-black transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Devenir prestataire</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-black mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li><a href="#" className="hover:text-black transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-10 text-center text-xs text-black/45">
          IciWork © 2026. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
