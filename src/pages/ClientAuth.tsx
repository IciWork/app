import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthSession, saveAuthSession } from "@/lib/auth";
import { hasSupabaseEnv, supabase } from "@/lib/supabase";

const inputClass =
  "h-11 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-[#E8F0EB]";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.3 12 2.3A9.7 9.7 0 0 0 2.3 12 9.7 9.7 0 0 0 12 21.7c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1.1-.2-1.5H12Z" />
    <path fill="#34A853" d="M3.4 7.5 6.6 9.9A6 6 0 0 1 12 6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.3 12 2.3c-3.7 0-6.9 2.1-8.6 5.2Z" />
    <path fill="#FBBC05" d="M12 21.7c2.5 0 4.7-.8 6.3-2.3l-2.9-2.4c-.8.6-1.9 1-3.4 1a6 6 0 0 1-5.7-4.2l-3.1 2.4A9.7 9.7 0 0 0 12 21.7Z" />
    <path fill="#4285F4" d="M21.3 12.3c0-.6-.1-1.1-.2-1.5H12v3.9h5.5c-.2 1.1-.9 2.1-2 2.8l2.9 2.4c1.7-1.6 2.9-4 2.9-7.6Z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current" aria-hidden="true">
    <path d="M16.8 12.7c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.7-1.7-3.2-1.7-1.3-.1-2.6.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1 8.4.7 1 1.5 2.2 2.6 2.1 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1 2.7-2 .8-1.1 1.1-2.1 1.1-2.2 0 0-2.2-.9-2.2-3.4ZM14.6 6.3c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-1 2.7 1 0 2-.5 2.7-1.3Z" />
  </svg>
);

const ClientAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const nextUrl = searchParams.get("next") || "/espace-client";
  const defaultMode = location.pathname.includes("connexion") ? "login" : "signup";
  const [mode, setMode] = useState<"signup" | "login">(defaultMode);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const pageTitle = useMemo(
    () =>
      mode === "signup"
        ? "Créer votre compte client"
        : "Connectez-vous à votre compte",
    [mode],
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!hasSupabaseEnv) {
      setErrorMsg("Configuration Supabase manquante.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            data: {
              first_name: form.firstName.trim(),
              last_name: form.lastName.trim(),
              role: "client",
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

        await supabase.from("clients").upsert(
          {
            auth_user_id: data.user.id,
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            postal_code: form.postalCode.trim(),
          },
          { onConflict: "auth_user_id" },
        );

        saveAuthSession({
          isAuthenticated: true,
          role: "client",
          email: form.email.trim(),
          firstName: form.firstName.trim() || "Client",
          createdAt: new Date().toISOString(),
        });
        navigate(nextUrl, { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error || !data.user) {
        setErrorMsg(error?.message || "Connexion impossible.");
        return;
      }

      const { data: provider } = await supabase
        .from("providers")
        .select("id, first_name")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (provider) {
        saveAuthSession({
          isAuthenticated: true,
          role: "provider",
          email: form.email.trim(),
          firstName: provider.first_name || "Prestataire",
          createdAt: new Date().toISOString(),
        });
        navigate("/espace-prestataire", { replace: true });
        return;
      }

      const { data: client } = await supabase
        .from("clients")
        .select("id, first_name")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      saveAuthSession({
        isAuthenticated: true,
        role: "client",
        email: form.email.trim(),
        firstName: client?.first_name || "Client",
        createdAt: new Date().toISOString(),
      });
      navigate(nextUrl, { replace: true });
    } catch {
      setErrorMsg("Une erreur est survenue. Réessaie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;
    if (session.role === "provider") {
      navigate("/espace-prestataire", { replace: true });
      return;
    }
    navigate("/espace-client", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    setIsAppleDevice(isIOS || isIPadOS);
  }, []);

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

        <section className="max-w-3xl mx-auto border rounded-2xl p-6 md:p-8" style={{ borderColor: "#ECEAE5", background: "#FFFFFF" }}>
          <div
            className="inline-flex rounded-full border p-1"
            style={{ borderColor: "#ECEAE5", background: "#F8F6F2" }}
          >
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                mode === "signup" ? "text-white" : "text-[#4A4F57]"
              }`}
              style={{ background: mode === "signup" ? "#3D7A5F" : "transparent" }}
            >
              Inscription
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                mode === "login" ? "text-white" : "text-[#4A4F57]"
              }`}
              style={{ background: mode === "login" ? "#3D7A5F" : "transparent" }}
            >
              Connexion
            </button>
          </div>

          <h1 className="mt-4 text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#8A8E96" }}>
            Continuez avec Google, Apple ou remplissez le formulaire email.
          </p>
          {errorMsg && (
            <p className="mt-2 text-sm" style={{ color: "#b42318" }}>
              {errorMsg}
            </p>
          )}
          {infoMsg && (
            <p className="mt-2 text-sm" style={{ color: "#3D7A5F" }}>
              {infoMsg}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="ghost"
              aria-label="Connexion Google"
              className="h-14 w-14 rounded-full border border-[#ECEAE5] bg-[#F8F6F2] p-0 hover:bg-[#F2EFE8] [&_svg]:!size-8"
            >
              <GoogleIcon />
            </Button>
            {isAppleDevice && (
              <Button
                type="button"
                variant="ghost"
                aria-label="Connexion Apple"
                className="h-14 w-14 rounded-full border border-[#ECEAE5] bg-[#F8F6F2] p-0 hover:bg-[#F2EFE8] [&_svg]:!size-10"
              >
                <AppleIcon />
              </Button>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "#ECEAE5" }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: "#8A8E96" }}>
              ou par email
            </span>
            <div className="h-px flex-1" style={{ background: "#ECEAE5" }} />
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                  <input
                    required
                    className={`${inputClass} pl-9`}
                    style={{ borderColor: "#ECEAE5" }}
                    placeholder="Prénom"
                    value={form.firstName}
                    onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                  <input
                    required
                    className={`${inputClass} pl-9`}
                    style={{ borderColor: "#ECEAE5" }}
                    placeholder="Nom"
                    value={form.lastName}
                    onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className={`relative ${mode === "login" ? "md:col-span-2" : ""}`}>
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
              <input
                type="email"
                required
                className={`${inputClass} pl-9`}
                style={{ borderColor: "#ECEAE5" }}
                placeholder="Adresse email"
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
              />
            </div>

            {mode === "signup" && (
              <>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                  <input
                    required
                    className={`${inputClass} pl-9`}
                    style={{ borderColor: "#ECEAE5" }}
                    placeholder="Numéro de téléphone"
                    value={form.phone}
                    onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                  />
                </div>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8E96]" />
                  <input
                    required
                    className={`${inputClass} pl-9`}
                    style={{ borderColor: "#ECEAE5" }}
                    placeholder="Code postal"
                    value={form.postalCode}
                    onChange={(e) => setForm((v) => ({ ...v, postalCode: e.target.value }))}
                  />
                </div>
              </>
            )}

            <input
              type="password"
              required
              className={`${
                mode === "login" ? "md:col-span-2" : "md:col-span-2"
              } ${inputClass}`}
              style={{ borderColor: "#ECEAE5" }}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
            />

            <div className="md:col-span-2 flex items-center justify-between mt-1">
              <span className="text-xs" style={{ color: "#8A8E96" }}>
                {mode === "signup"
                  ? "Vous pourrez compléter votre profil après création."
                  : "Connexion sécurisée à votre espace client."}
              </span>
              <Button type="submit" style={{ background: "#3D7A5F", color: "#FFFFFF" }}>
                {isSubmitting ? "Chargement..." : mode === "signup" ? "Créer mon compte" : "Me connecter"}
              </Button>
            </div>
          </form>

          <p className="mt-5 text-sm" style={{ color: "#4A4F57" }}>
            Vous êtes professionnel ?{" "}
            <Link to="/inscription-prestataire" className="font-medium underline underline-offset-2">
              Créer un compte prestataire
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default ClientAuth;
