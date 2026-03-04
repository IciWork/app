import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Briefcase,
  CheckCircle2,
  CircleUserRound,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

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

type ProviderExtraDraft = {
  photoUrl: string;
  title: string;
  description: string;
  siret: string;
  companyName: string;
};

const inputClass =
  "h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-[#E8F0EB]";

const readSignupDraft = (): ProviderDraft | null => {
  try {
    const raw = localStorage.getItem("provider-signup-draft");
    if (!raw) return null;
    return JSON.parse(raw) as ProviderDraft;
  } catch {
    return null;
  }
};

const readExtraDraft = (): ProviderExtraDraft => {
  try {
    const raw = localStorage.getItem("provider-profile-extra-draft");
    if (!raw) {
      return { photoUrl: "", title: "", description: "", siret: "", companyName: "" };
    }
    return JSON.parse(raw) as ProviderExtraDraft;
  } catch {
    return { photoUrl: "", title: "", description: "", siret: "", companyName: "" };
  }
};

const ProviderMyProfile = () => {
  const signupDraft = useMemo(() => readSignupDraft(), []);
  const [extra, setExtra] = useState<ProviderExtraDraft>(() => readExtraDraft());
  const [saved, setSaved] = useState(false);

  const isProfessional = signupDraft?.providerType === "professionnel";

  if (!signupDraft) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF" }}>
        <Header />
        <main className="container mx-auto px-4 py-10 md:py-14 flex-1">
          <section
            className="max-w-3xl mx-auto border rounded-2xl p-6 md:p-8"
            style={{ borderColor: "#ECEAE5" }}
          >
            <h1 className="text-2xl font-semibold" style={{ color: "#1C1F23" }}>
              Mon profil prestataire
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
              Aucun profil trouve. Commencez par l'inscription prestataire.
            </p>
            <Button asChild className="mt-5" style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
              <Link to="/inscription-prestataire">Completer mon inscription</Link>
            </Button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const saveProfile = () => {
    localStorage.setItem("provider-profile-extra-draft", JSON.stringify(extra));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF" }}>
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <section className="rounded-3xl border p-6 md:p-8" style={{ borderColor: "#ECEAE5", background: "#FFFFFF" }}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#4A4F57" }}
                >
                  <ShieldCheck size={14} />
                  Espace prestataire
                </span>
                <h1 className="mt-3 text-3xl md:text-[36px] font-semibold leading-tight" style={{ color: "#1C1F23" }}>
                  Mon profil
                </h1>
                <p className="mt-2 text-sm md:text-[15px]" style={{ color: "#8A8E96" }}>
                  Personnalisez votre fiche publique pour inspirer confiance et recevoir plus de demandes.
                </p>
                {saved && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm" style={{ color: "#3D7A5F" }}>
                    <CheckCircle2 size={16} />
                    Modifications enregistrees
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="border-black/20 bg-white text-black hover:bg-black/[0.03]">
                  <Link to="/espace-prestataire">Retour dashboard</Link>
                </Button>
                <Button type="button" onClick={saveProfile} style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                  Enregistrer
                </Button>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <aside className="lg:col-span-1 space-y-5">
                <article className="rounded-2xl border p-5" style={{ borderColor: "#ECEAE5" }}>
                  <p className="text-sm font-semibold" style={{ color: "#1C1F23" }}>
                    Apercu public
                  </p>
                  <div className="mt-3 text-sm" style={{ color: "#4A4F57" }}>
                    <p className="font-medium" style={{ color: "#1C1F23" }}>
                      {extra.title || signupDraft.primaryJob || "Professionnel independant"}
                    </p>
                    <p className="mt-1" style={{ color: "#8A8E96" }}>
                      {signupDraft.primaryCategory}
                    </p>
                    <p className="mt-3 line-clamp-4" style={{ color: "#4A4F57" }}>
                      {extra.description || "Ajoutez une description claire de votre activite et de vos points forts."}
                    </p>
                  </div>
                </article>
              </aside>

              <section className="lg:col-span-2 space-y-5">
                <article className="rounded-2xl border p-5" style={{ borderColor: "#ECEAE5" }}>
                  <p className="text-sm font-semibold" style={{ color: "#1C1F23" }}>
                    Informations de base
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <CircleUserRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                      <input className={`${inputClass} pl-9`} style={{ borderColor: "#ECEAE5" }} value={`${signupDraft.firstName} ${signupDraft.lastName}`.trim()} readOnly />
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                      <input className={`${inputClass} pl-9`} style={{ borderColor: "#ECEAE5" }} value={signupDraft.email} readOnly />
                    </div>
                    <div className="relative md:col-span-2">
                      <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                      <input
                        className={`${inputClass} pl-9`}
                        style={{ borderColor: "#ECEAE5" }}
                        placeholder="Titre de presentation"
                        value={extra.title}
                        onChange={(e) => setExtra((v) => ({ ...v, title: e.target.value }))}
                      />
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border p-5" style={{ borderColor: "#ECEAE5" }}>
                  <p className="text-sm font-semibold" style={{ color: "#1C1F23" }}>
                    Activite et zone
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className={inputClass} style={{ borderColor: "#ECEAE5" }} value={signupDraft.primaryCategory} readOnly />
                    <input className={inputClass} style={{ borderColor: "#ECEAE5" }} value={signupDraft.primaryJob} readOnly />
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                      <input className={`${inputClass} pl-9`} style={{ borderColor: "#ECEAE5" }} value={signupDraft.postalCode} readOnly />
                    </div>
                    <input className={inputClass} style={{ borderColor: "#ECEAE5" }} value={`${signupDraft.interventionRadius} km`} readOnly />
                  </div>
                </article>

                <article className="rounded-2xl border p-5" style={{ borderColor: "#ECEAE5" }}>
                  <p className="text-sm font-semibold" style={{ color: "#1C1F23" }}>
                    Description
                  </p>
                  <textarea
                    className="mt-4 w-full min-h-[170px] rounded-xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8F0EB]"
                    style={{ borderColor: "#ECEAE5" }}
                    placeholder="Presentez votre experience, vos specialites et votre facon de travailler."
                    value={extra.description}
                    onChange={(e) => setExtra((v) => ({ ...v, description: e.target.value }))}
                  />
                </article>

                {isProfessional && (
                  <article className="rounded-2xl border p-5" style={{ borderColor: "#ECEAE5" }}>
                    <p className="text-sm font-semibold" style={{ color: "#1C1F23" }}>
                      Informations entreprise
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        style={{ borderColor: "#ECEAE5" }}
                        placeholder="Nom d'entreprise"
                        value={extra.companyName || signupDraft.companyName || ""}
                        onChange={(e) => setExtra((v) => ({ ...v, companyName: e.target.value }))}
                      />
                      <input
                        className={inputClass}
                        style={{ borderColor: "#ECEAE5" }}
                        placeholder="Numero SIRET"
                        value={extra.siret || signupDraft.siret || ""}
                        onChange={(e) => setExtra((v) => ({ ...v, siret: e.target.value }))}
                      />
                    </div>
                  </article>
                )}

                <article className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: "#ECEAE5", background: "#F8F6F2" }}>
                  <div className="text-sm" style={{ color: "#4A4F57" }}>
                    Mettez a jour votre profil regulierement pour rester visible et credible.
                  </div>
                  <Button type="button" onClick={saveProfile} style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                    Enregistrer maintenant
                  </Button>
                </article>
              </section>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderMyProfile;
