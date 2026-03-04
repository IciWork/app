import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = getAuthSession();
  const isVisitorHome = location.pathname === "/" && !session;
  const isLoggedIn = Boolean(session);
  const dashboardPath = session?.role === "provider" ? "/espace-prestataire" : "/espace-client";

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/prestataires", label: "Prestataires" },
    { to: "/inscription-prestataire", label: "Devenir prestataire" },
  ];

  const visibleNavLinks = isVisitorHome ? [] : navLinks;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    if (hasSupabaseEnv) {
      await supabase.auth.signOut();
    }
    clearAuthSession();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold tracking-tight">
            <span className="text-black">Ici</span>
            <span style={{ color: "rgb(61, 122, 95)" }}>Work</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center">
          {visibleNavLinks.map((link, idx) => (
            <div key={link.to} className="flex items-center">
              <Link
                to={link.to}
                className={`px-4 text-sm font-medium transition-colors ${
                  isActive(link.to) ? "text-black" : "text-black/80 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
              {idx < visibleNavLinks.length - 1 && <span className="h-4 w-px bg-black/20" />}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              {isVisitorHome && (
                <Button asChild variant="ghost" size="sm" className="h-9 px-4 border border-black text-black hover:bg-black/5">
                  <Link to="/inscription-prestataire">Devenir prestataire</Link>
                </Button>
              )}

              <Button asChild variant="ghost" size="sm" className="h-9 px-4 border border-black text-black hover:bg-black/5">
                <Link to="/connexion-client">Connexion</Link>
              </Button>

              <Button asChild size="sm" className="h-9 px-4 font-semibold" style={{ backgroundColor: "rgb(61, 122, 95)", color: "#fff" }}>
                <Link to="/inscription-client">Inscription</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="h-9 px-4 border border-black text-black hover:bg-black/5">
                <Link to={dashboardPath}>Mon espace</Link>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-9 px-4 border border-black text-black hover:bg-black/5" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {!isLoggedIn && (
            <Button asChild size="sm" className="h-9 px-4 font-semibold" style={{ backgroundColor: "rgb(61, 122, 95)", color: "#fff" }}>
              <Link to="/inscription-client">Inscription</Link>
            </Button>
          )}

          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-black hover:bg-black/5"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            aria-label="Fermer le menu mobile"
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="md:hidden fixed top-0 right-0 z-50 h-dvh w-1/2 min-w-[280px] bg-white border-l border-black/10 animate-fade-in">
            <div className="h-16 px-4 flex items-center justify-end border-b border-black/10">
              <button
                aria-label="Fermer le menu mobile"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-black/5"
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4">
              {visibleNavLinks.length > 0 && (
                <nav className="flex flex-col gap-1">
                  {visibleNavLinks.map((link, idx) => (
                    <div key={link.to}>
                      <Link
                        to={link.to}
                        className={`block text-base font-medium py-3 ${
                          isActive(link.to) ? "text-black" : "text-black/80 hover:text-black"
                        }`}
                      >
                        {link.label}
                      </Link>
                      {idx < visibleNavLinks.length - 1 && <div className="h-px bg-black/10" />}
                    </div>
                  ))}
                </nav>
              )}

              <div className={`${visibleNavLinks.length > 0 ? "pt-4 mt-2 border-t border-black/10" : ""}`}>
                {!isLoggedIn ? (
                  <>
                    {isVisitorHome && (
                      <Button asChild variant="ghost" size="sm" className="w-full h-11 border border-black text-black hover:bg-black/5 mb-2">
                        <Link to="/inscription-prestataire">Devenir prestataire</Link>
                      </Button>
                    )}

                    <Button asChild variant="ghost" size="sm" className="w-full h-11 border border-black text-black hover:bg-black/5">
                      <Link to="/connexion-client">Connexion</Link>
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button asChild variant="ghost" size="sm" className="w-full h-11 border border-black text-black hover:bg-black/5">
                      <Link to={dashboardPath}>Mon espace</Link>
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="w-full h-11 border border-black text-black hover:bg-black/5" onClick={handleLogout}>
                      Déconnexion
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};

export default Header;
