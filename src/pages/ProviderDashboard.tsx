import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { BadgeCheck, Clock3, MapPin, Briefcase, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProviderDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  providerType: "particulier" | "professionnel";
  companyName: string;
  siret: string;
  primaryCategory: string;
  primaryJob: string;
  postalCode: string;
  interventionRadius: string;
};

const readDraft = (): ProviderDraft | null => {
  try {
    const raw = localStorage.getItem("provider-signup-draft");
    if (!raw) return null;
    return JSON.parse(raw) as ProviderDraft;
  } catch {
    return null;
  }
};

const ProviderDashboard = () => {
  const draft = useMemo(() => readDraft(), []);
  const [remindLater, setRemindLater] = useState(() => localStorage.getItem("provider-profile-remind-later") === "1");

  if (!draft) {
    return (
      <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
        <main className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl mx-auto mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-display font-bold tracking-tight">
                <span className="text-black">Ici</span>
                <span style={{ color: "rgb(61, 122, 95)" }}>Work</span>
              </span>
            </Link>
          </div>

          <section className="max-w-3xl mx-auto border rounded-2xl p-6 md:p-8" style={{ borderColor: "#ECEAE5" }}>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
              Espace prestataire
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
              Aucun profil n'a ete trouve pour le moment.
            </p>
            <div className="mt-6">
              <Button asChild style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                <Link to="/inscription-prestataire">Completer mon inscription</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl font-display font-bold tracking-tight">
              <span className="text-black">Ici</span>
              <span style={{ color: "rgb(61, 122, 95)" }}>Work</span>
            </span>
          </Link>
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#4A4F57" }}
          >
            <Clock3 size={14} />
            Profil en cours de verification
          </span>
        </div>

        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          <article className="lg:col-span-2 border rounded-2xl p-6" style={{ borderColor: "#ECEAE5" }}>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
              Bonjour {draft.firstName}
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
              Votre espace prestataire est pret. Vous pourrez bientot recevoir vos premieres demandes.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border p-4" style={{ borderColor: "#ECEAE5" }}>
                <p className="font-medium flex items-center gap-2" style={{ color: "#1C1F23" }}>
                  <CircleUserRound size={16} />
                  Identite
                </p>
                <p className="mt-2" style={{ color: "#4A4F57" }}>
                  {draft.firstName} {draft.lastName}
                </p>
                <p style={{ color: "#8A8E96" }}>{draft.email}</p>
                <p style={{ color: "#8A8E96" }}>{draft.phone}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "#ECEAE5" }}>
                <p className="font-medium flex items-center gap-2" style={{ color: "#1C1F23" }}>
                  <Briefcase size={16} />
                  Activite
                </p>
                <p className="mt-2" style={{ color: "#4A4F57" }}>{draft.primaryCategory}</p>
                <p style={{ color: "#8A8E96" }}>{draft.primaryJob}</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "#ECEAE5" }}>
                <p className="font-medium flex items-center gap-2" style={{ color: "#1C1F23" }}>
                  <MapPin size={16} />
                  Zone d'intervention
                </p>
                <p className="mt-2" style={{ color: "#4A4F57" }}>Code postal: {draft.postalCode}</p>
                <p style={{ color: "#8A8E96" }}>Rayon: {draft.interventionRadius} km</p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "#ECEAE5" }}>
                <p className="font-medium flex items-center gap-2" style={{ color: "#1C1F23" }}>
                  <BadgeCheck size={16} />
                  Statut
                </p>
                <p className="mt-2" style={{ color: "#4A4F57" }}>Compte cree</p>
                <p style={{ color: "#8A8E96" }}>Verification en attente</p>
              </div>
            </div>
          </article>

          <aside className="border rounded-2xl p-6 h-fit" style={{ borderColor: "#ECEAE5" }}>
            <h2 className="text-lg font-semibold" style={{ color: "#1C1F23" }}>
              Prochaines etapes
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
              Vous pouvez completer ces etapes maintenant ou plus tard. Votre compte reste accessible.
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <Link to="/espace-prestataire/mon-profil" className="block hover:underline" style={{ color: "#4A4F57" }}>
                1. Verifier votre email
              </Link>
              <Link to="/espace-prestataire/mon-profil" className="block hover:underline" style={{ color: "#4A4F57" }}>
                2. Ajouter photo et description
              </Link>
              <Link to="/espace-prestataire/mon-profil" className="block hover:underline" style={{ color: "#4A4F57" }}>
                3. Ajouter SIRET (si pro)
              </Link>
              <Link to="/espace-prestataire/mon-profil" className="block hover:underline" style={{ color: "#4A4F57" }}>
                4. Publier votre profil
              </Link>
            </div>
            <div className="mt-5 space-y-2">
              <Button asChild className="w-full" style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                <Link to="/espace-prestataire/mon-profil">Completer mon profil</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-black/20 bg-white text-black hover:bg-black/[0.03]">
                <Link
                  to="/espace-prestataire/mon-profil"
                  onClick={() => {
                    localStorage.setItem("provider-profile-remind-later", "1");
                    setRemindLater(true);
                  }}
                >
                  Je completerai plus tard
                </Link>
              </Button>
            </div>
            {remindLater && (
              <p className="mt-3 text-xs" style={{ color: "#8A8E96" }}>
                D'accord. Vous pourrez reprendre la completion depuis ce bouton quand vous voulez.
              </p>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
};

export default ProviderDashboard;
