import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAuthSession } from "@/lib/auth";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import {
  Wrench,
  Zap,
  Paintbrush,
  Construction,
  Hammer,
  LayoutGrid,
  Home,
  Shield,
  Trees,
  Package,
  Sparkles,
  Drill,
  Car,
  Laptop,
  Baby,
  PawPrint,
  HeartHandshake,
  BookOpen,
  Scissors,
  FileText,
  Dumbbell,
  Utensils,
  Camera,
} from "lucide-react";

type Step = 1 | 2 | 3;
type ProviderType = "particulier" | "professionnel";

type ServiceCategory = {
  id: string;
  label: string;
  jobs: string[];
  subcategories: string[];
  icon: ReactNode;
};

const inputClass = "h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-[#E8F0EB]";

const categories: ServiceCategory[] = [
  { id: "plomberie", label: "Plomberie", jobs: ["Plombier", "Plombier-chauffagiste"], subcategories: ["Installation", "Depannage", "Fuite", "Sanitaires", "Chauffe-eau", "Chaudiere"], icon: <Wrench size={18} /> },
  { id: "electricite", label: "Electricite", jobs: ["Electricien"], subcategories: ["Installation", "Depannage", "Mise aux normes", "Tableau electrique", "Eclairage"], icon: <Zap size={18} /> },
  { id: "peinture", label: "Peinture & Revetements", jobs: ["Peintre", "Peintre en batiment", "Facadier"], subcategories: ["Peinture interieure", "Peinture exterieure", "Tapisserie", "Crepi", "Ravalement"], icon: <Paintbrush size={18} /> },
  { id: "maconnerie", label: "Maconnerie & Gros oeuvre", jobs: ["Macon", "Coffreur", "Manoeuvre BTP"], subcategories: ["Murs", "Dalles", "Fondations", "Demolition", "Ouverture murs porteurs"], icon: <Construction size={18} /> },
  { id: "menuiserie", label: "Menuiserie", jobs: ["Menuisier", "Ebeniste", "Poseur de cuisine"], subcategories: ["Portes", "Fenetres", "Placards", "Escaliers", "Parquet", "Pose de cuisine"], icon: <Hammer size={18} /> },
  { id: "sols", label: "Carrelage & Sols", jobs: ["Carreleur", "Solier", "Parqueteur"], subcategories: ["Carrelage", "Faience", "Parquet", "Stratifie", "Lino", "Chape"], icon: <LayoutGrid size={18} /> },
  { id: "toiture", label: "Toiture & Isolation", jobs: ["Couvreur", "Zingueur", "Etancheur", "Isolateur"], subcategories: ["Couverture", "Zinguerie", "Isolation thermique", "Isolation phonique", "Etancheite"], icon: <Home size={18} /> },
  { id: "serrurerie", label: "Serrurerie & Vitrerie", jobs: ["Serrurier", "Vitrier"], subcategories: ["Ouverture de porte", "Changement serrure", "Remplacement vitrage"], icon: <Shield size={18} /> },
  { id: "jardinage", label: "Jardinage & Espaces verts", jobs: ["Jardinier", "Paysagiste", "Elagueur"], subcategories: ["Tonte", "Taille de haies", "Elagage", "Debroussaillage", "Amenagement", "Cloture", "Terrasse"], icon: <Trees size={18} /> },
  { id: "demenagement", label: "Demenagement & Manutention", jobs: ["Demenageur", "Manutentionnaire"], subcategories: ["Demenagement complet", "Aide ponctuelle", "Transport", "Enlevement encombrants"], icon: <Package size={18} /> },
  { id: "menage", label: "Menage & Entretien", jobs: ["Homme/Femme de menage", "Agent d'entretien", "Nettoyeur"], subcategories: ["Menage regulier", "Menage ponctuel", "Repassage", "Vitres", "Nettoyage fin de chantier", "Nettoyage facade"], icon: <Sparkles size={18} /> },
  { id: "bricolage", label: "Bricolage & Petits travaux", jobs: ["Bricoleur", "Homme toutes mains"], subcategories: ["Montage meubles", "Fixations", "Etageres", "Petites reparations"], icon: <Drill size={18} /> },
  { id: "mecanique", label: "Mecanique & Vehicules", jobs: ["Mecanicien", "Carrossier", "Garagiste"], subcategories: ["Revision", "Freins", "Carrosserie", "Diagnostic", "Pneus"], icon: <Car size={18} /> },
  { id: "informatique", label: "Informatique & Multimedia", jobs: ["Technicien informatique", "Depanneur informatique"], subcategories: ["Depannage PC", "Installation", "Recuperation donnees", "Aide smartphone", "Installation TV"], icon: <Laptop size={18} /> },
  { id: "seniors", label: "Aide aux personnes agees", jobs: ["Aide a domicile", "Auxiliaire de vie", "Accompagnant"], subcategories: ["Compagnie", "Courses", "Preparation repas", "Accompagnement rendez-vous", "Aide a la mobilite", "Aide lever/coucher"], icon: <HeartHandshake size={18} /> },
  { id: "garde-enfants", label: "Garde d'enfants", jobs: ["Baby-sitter", "Nounou", "Assistante maternelle"], subcategories: ["Baby-sitting", "Sortie d'ecole", "Garde a domicile", "Nounou ponctuelle", "Garde partagee"], icon: <Baby size={18} /> },
  { id: "cours", label: "Cours & Soutien scolaire", jobs: ["Professeur particulier", "Tuteur", "Coach scolaire"], subcategories: ["Aide aux devoirs", "Maths", "Francais", "Langues", "Preparation examens", "Cours de musique", "Informatique pour seniors"], icon: <BookOpen size={18} /> },
  { id: "animaux", label: "Garde d'animaux", jobs: ["Pet-sitter", "Promeneur de chiens"], subcategories: ["Pet-sitting a domicile", "Promenade", "Hebergement", "Visite pendant vacances"], icon: <PawPrint size={18} /> },
  { id: "couture", label: "Couture & Retouche", jobs: ["Couturiere", "Retoucheur"], subcategories: ["Ourlet", "Retouche vetements", "Reparation", "Couture sur mesure"], icon: <Scissors size={18} /> },
  { id: "administratif", label: "Aide administrative", jobs: ["Assistant administratif", "Ecrivain public"], subcategories: ["Declaration d'impots", "Dossiers administratifs", "Courriers", "Aide demarches en ligne"], icon: <FileText size={18} /> },
  { id: "bien-etre", label: "Bien-etre & Coaching", jobs: ["Coach sportif", "Prof de yoga", "Praticien bien-etre"], subcategories: ["Coaching sportif", "Yoga", "Remise en forme", "Preparation physique"], icon: <Dumbbell size={18} /> },
  { id: "cuisine", label: "Cuisine a domicile", jobs: ["Cuisinier a domicile", "Chef a domicile", "Traiteur"], subcategories: ["Preparation de repas", "Livraison plats maison", "Chef ponctuel", "Cours de cuisine"], icon: <Utensils size={18} /> },
  { id: "evenementiel", label: "Evenementiel", jobs: ["Photographe", "Videaste", "DJ", "Decorateur"], subcategories: ["Photo", "Video", "DJ", "Decoration", "Animation"], icon: <Camera size={18} /> },
];

const ProviderSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = useMemo(() => new URLSearchParams(location.search).has("edit"), [location.search]);
  const [step, setStep] = useState<Step>(1);
  const [providerType, setProviderType] = useState<ProviderType>("particulier");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    siret: "",
    companyName: "",
    postalCode: "",
    interventionRadius: "20",
    primaryCategory: "",
    primaryJob: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const currentStep: Step = isEditMode ? 3 : step;
  const progressLabel = useMemo(() => `${currentStep}/3`, [currentStep]);

  const primaryCategoryObject = useMemo(
    () => categories.find((cat) => cat.id === form.primaryCategory) || null,
    [form.primaryCategory],
  );

  const canGoStep2 =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.phone.trim();

  const canGoStep3 =
    providerType === "particulier" || (form.siret.trim() && form.companyName.trim());

  const canSubmit =
    form.primaryCategory &&
    form.primaryJob &&
    form.postalCode.trim();

  useEffect(() => {
    if (!isEditMode) return;
    setStep(3);
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;
    try {
      const raw = localStorage.getItem("provider-signup-draft");
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        providerType?: ProviderType;
        companyName?: string;
        siret?: string;
        primaryCategoryId?: string;
        primaryCategory?: string;
        primaryJob?: string;
        postalCode?: string;
        interventionRadius?: string;
      };

      const normalized = (value: string) =>
        value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();

      const resolvedCategoryId =
        draft.primaryCategoryId ||
        (draft.primaryCategory
          ? categories.find((cat) => normalized(cat.label) === normalized(draft.primaryCategory || ""))?.id || ""
          : "");

      setProviderType(draft.providerType || "particulier");
      setForm((prev) => ({
        ...prev,
        firstName: draft.firstName || "",
        lastName: draft.lastName || "",
        email: draft.email || "",
        phone: draft.phone || "",
        companyName: draft.companyName || "",
        siret: draft.siret || "",
        primaryCategory: resolvedCategoryId,
        primaryJob: draft.primaryJob || "",
        postalCode: draft.postalCode || "",
        interventionRadius: draft.interventionRadius || "20",
      }));
      setStep(3);
    } catch {
      // no-op
    }
  }, [isEditMode]);

  const handleFinish = async () => {
    if (!canSubmit) return;
    setErrorMsg("");
    setInfoMsg("");

    localStorage.setItem(
      "provider-signup-draft",
      JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        providerType,
        companyName: form.companyName,
        siret: form.siret,
        primaryCategoryId: form.primaryCategory,
        primaryCategory: categories.find((cat) => cat.id === form.primaryCategory)?.label || "",
        primaryJob: form.primaryJob,
        postalCode: form.postalCode,
        interventionRadius: form.interventionRadius,
      }),
    );

    if (!hasSupabaseEnv) {
      saveAuthSession({
        isAuthenticated: true,
        role: "provider",
        email: form.email,
        firstName: form.firstName,
        createdAt: new Date().toISOString(),
      });
      navigate("/espace-prestataire");
      return;
    }

    setIsSubmitting(true);
    try {
      let userId: string | null = null;

      if (!isEditMode) {
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            data: {
              first_name: form.firstName.trim(),
              last_name: form.lastName.trim(),
              role: "provider",
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (!data.session || !data.user) {
          setInfoMsg("Compte créé. Vérifie ton email puis connecte-toi.");
          return;
        }

        userId = data.user.id;
      } else {
        const { data: userData } = await supabase.auth.getUser();
        userId = userData.user?.id ?? null;
      }

      if (!userId) {
        setErrorMsg("Session introuvable. Reconnecte-toi.");
        return;
      }

      const { error: profileError } = await supabase.from("providers").upsert(
        {
          auth_user_id: userId,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          provider_type: providerType,
          company_name: form.companyName.trim() || null,
          siret: form.siret.trim() || null,
          primary_category: categories.find((cat) => cat.id === form.primaryCategory)?.label || null,
          primary_job: form.primaryJob.trim() || null,
          postal_code: form.postalCode.trim(),
          intervention_radius_km: Number(form.interventionRadius || "20"),
          is_published: false,
        },
        { onConflict: "auth_user_id" },
      );

      if (profileError) {
        setErrorMsg(profileError.message);
        return;
      }

      saveAuthSession({
        isAuthenticated: true,
        role: "provider",
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        createdAt: new Date().toISOString(),
      });

      navigate("/espace-prestataire");
    } catch {
      setErrorMsg("Une erreur est survenue. Réessaie.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <section className="max-w-4xl mx-auto border rounded-2xl p-6 md:p-8" style={{ borderColor: "#ECEAE5", background: "#FFFFFF" }}>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#4A4F57" }}
          >
            Devenir prestataire · Phase {progressLabel}
          </span>
          {errorMsg && (
            <p className="mt-3 text-sm" style={{ color: "#b42318" }}>
              {errorMsg}
            </p>
          )}
          {infoMsg && (
            <p className="mt-3 text-sm" style={{ color: "#3D7A5F" }}>
              {infoMsg}
            </p>
          )}

          {currentStep === 1 && (
            <>
              <h1 className="mt-4 text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
                Creez votre compte
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
                Phase 1 · Identite
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Prenom" value={form.firstName} onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))} />
                <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Nom" value={form.lastName} onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))} />
                <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
                <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Mot de passe" type="password" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />
                <input className={`${inputClass} md:col-span-2`} style={{ borderColor: "#ECEAE5" }} placeholder="Telephone (verifie par SMS)" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="button" disabled={!canGoStep2} onClick={() => setStep(2)} style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                  Suivant →
                </Button>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h1 className="mt-4 text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
                Quel est votre profil ?
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
                Phase 2 · Statut
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <button type="button" onClick={() => setProviderType("particulier")} className="text-left rounded-xl border px-4 py-3 transition-colors hover:bg-black/[0.02]" style={{ borderColor: providerType === "particulier" ? "#1C1F23" : "#ECEAE5" }}>
                  Particulier
                </button>
                <button type="button" onClick={() => setProviderType("professionnel")} className="text-left rounded-xl border px-4 py-3 transition-colors hover:bg-black/[0.02]" style={{ borderColor: providerType === "professionnel" ? "#1C1F23" : "#ECEAE5" }}>
                  Professionnel
                </button>
              </div>

              {providerType === "professionnel" && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Numero SIRET" value={form.siret} onChange={(e) => setForm((v) => ({ ...v, siret: e.target.value }))} />
                  <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Nom d'entreprise" value={form.companyName} onChange={(e) => setForm((v) => ({ ...v, companyName: e.target.value }))} />
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" className="bg-white border-black/20 text-black hover:bg-white" onClick={() => setStep(1)}>
                  ← Precedent
                </Button>
                <Button type="button" disabled={!canGoStep3} onClick={() => setStep(3)} style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                  Suivant →
                </Button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h1 className="mt-4 text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
                Que proposez-vous ?
              </h1>
              <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
                Phase 3 · Activite
              </p>

              <div className="mt-6">
                <label className="text-sm font-medium" style={{ color: "#1C1F23" }}>
                  Categorie
                </label>
                <select
                  value={form.primaryCategory}
                  onChange={(e) => {
                    const category = e.target.value;
                    setForm((v) => ({ ...v, primaryCategory: category, primaryJob: "" }));
                  }}
                  className={`${inputClass} mt-2 w-full`}
                  style={{ borderColor: "#ECEAE5" }}
                >
                  <option value="">Selectionnez une categorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {primaryCategoryObject && (
                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      className={inputClass}
                      style={{ borderColor: "#ECEAE5" }}
                      value={form.primaryJob}
                      onChange={(e) => setForm((v) => ({ ...v, primaryJob: e.target.value }))}
                    >
                      <option value="">Metier principal</option>
                      {primaryCategoryObject?.jobs.map((job) => (
                        <option key={job} value={job}>
                          {job}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className={inputClass} style={{ borderColor: "#ECEAE5" }} placeholder="Code postal" value={form.postalCode} onChange={(e) => setForm((v) => ({ ...v, postalCode: e.target.value }))} />
                <select className={inputClass} style={{ borderColor: "#ECEAE5" }} value={form.interventionRadius} onChange={(e) => setForm((v) => ({ ...v, interventionRadius: e.target.value }))}>
                  <option value="10">Rayon d'intervention · 10 km</option>
                  <option value="20">Rayon d'intervention · 20 km</option>
                  <option value="30">Rayon d'intervention · 30 km</option>
                  <option value="50">Rayon d'intervention · 50 km</option>
                </select>
              </div>

              <div className="mt-6 flex justify-between">
                {isEditMode ? (
                  <Button asChild type="button" variant="outline" className="bg-white border-black/20 text-black hover:bg-white">
                    <Link to="/espace-prestataire">← Retour dashboard</Link>
                  </Button>
                ) : (
                  <Button type="button" variant="outline" className="bg-white border-black/20 text-black hover:bg-white" onClick={() => setStep(2)}>
                    ← Precedent
                  </Button>
                )}
                <Button type="button" disabled={!canSubmit || isSubmitting} style={{ background: "#3D7A5F", color: "#FFFFFF" }} onClick={handleFinish}>
                  {isSubmitting ? "Chargement..." : "C'est parti"}
                </Button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProviderSignup;
