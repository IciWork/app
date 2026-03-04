import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Zap,
  Leaf,
  Home,
  Truck,
  Monitor,
  Hammer,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Users,
  MessageSquare,
  Quote,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import ProviderCard from "@/components/ProviderCard";
import { categories, providers } from "@/lib/data";
import { getAuthSession } from "@/lib/auth";

const RECENT_SEARCHES_KEY = "recent-home-searches";
const MAX_RECENT_SEARCHES = 5;

/* ── palette tokens ── */
const palette = {
  bg: "#FAFAF7",
  bgAlt: "#FFFFFF",
  navy: "#0F1923",
  navyMid: "#1A2D44",
  accent: "#3D7A5F",
  accentLight: "#E8F0EB",
  terracotta: "#C17A52",
  terracottaLight: "rgba(193,122,82,0.10)",
  heading: "#1C1F23",
  text: "#4A4F57",
  textLight: "#8A8E96",
  border: "#ECEAE5",
  borderHover: "#3D7A5F",
  gold: "#C9A84C",
  goldLight: "#E8C87A",
};

const Index = () => {
  const navigate = useNavigate();
  const session = getAuthSession();
  const isAuthenticated = Boolean(session);
  const [searchService, setSearchService] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const mobileCategoriesRef = useRef<HTMLDivElement | null>(null);

  const featuredProviders = providers.filter((p) => p.rating >= 4.7).slice(0, 4);

  const cities = [
    { name: "Paris", count: 1240 },
    { name: "Lyon", count: 486 },
    { name: "Marseille", count: 412 },
    { name: "Bordeaux", count: 298 },
    { name: "Toulouse", count: 334 },
    { name: "Lille", count: 276 },
  ];

  const serviceHighlights = [
    { icon: <Wrench size={16} />, label: "Plomberie" },
    { icon: <Zap size={16} />, label: "Électricité" },
    { icon: <Leaf size={16} />, label: "Jardinage" },
    { icon: <Home size={16} />, label: "Ménage" },
    { icon: <Truck size={16} />, label: "Déménagement" },
    { icon: <Monitor size={16} />, label: "Informatique" },
    { icon: <Hammer size={16} />, label: "Rénovation" },
    { icon: <BookOpen size={16} />, label: "Cours à domicile" },
  ];

  const steps = [
    {
      icon: <Search size={22} />,
      title: "Décrivez votre besoin",
      desc: "Indiquez le service recherché et votre localisation. C'est gratuit et sans engagement.",
    },
    {
      icon: <Users size={22} />,
      title: "Comparez les profils",
      desc: "Parcourez les avis, tarifs et disponibilités des professionnels indépendants près de chez vous.",
    },
    {
      icon: <MessageSquare size={22} />,
      title: "Contactez directement",
      desc: "Échangez avec le professionnel, convenez des modalités. Vous gérez en direct.",
    },
  ];

  const testimonials = [
    {
      text: "J'avais une fuite urgente un dimanche. En 20 minutes j'ai trouvé un plombier disponible qui est intervenu dans l'heure.",
      name: "Caroline L.",
      location: "Paris · Plomberie",
      initials: "CL",
    },
    {
      text: "Les avis m'ont permis de comparer plusieurs électriciens. J'ai choisi en confiance et le résultat était impeccable.",
      name: "Thomas M.",
      location: "Lyon · Électricité",
      initials: "TM",
    },
    {
      text: "Très pratique pour trouver un jardinier régulier. Je consulte les disponibilités et les tarifs avant de contacter.",
      name: "Sophie F.",
      location: "Bordeaux · Jardinage",
      initials: "SF",
    },
  ];

  const platformPoints = [
    {
      icon: <Shield size={20} />,
      title: "Profils vérifiés",
      desc: "Identité, assurances et qualifications contrôlées avant publication sur la plateforme.",
    },
    {
      icon: <Star size={20} />,
      title: "Avis transparents",
      desc: "Seuls les particuliers ayant bénéficié d'une prestation peuvent laisser un avis.",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Médiation si besoin",
      desc: "En cas de désaccord, notre équipe intervient pour trouver une solution entre les parties.",
    },
  ];

  const quickStats = [
    { value: "12 000+", label: "Professionnels inscrits" },
    { value: "4.8/5", label: "Note moyenne" },
    { value: "< 45 min", label: "Temps de réponse" },
    { value: "350+", label: "Villes couvertes" },
  ];

  const matchingHighlights = useMemo(() => {
    if (!searchService.trim()) return serviceHighlights.slice(0, 4);
    return serviceHighlights
      .filter((item) => item.label.toLowerCase().includes(searchService.trim().toLowerCase()))
      .slice(0, 4);
  }, [searchService]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);

  const scrollCategories = (direction: "left" | "right") => {
    const node = mobileCategoriesRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === "right" ? 220 : -220, behavior: "smooth" });
  };

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item) => typeof item === "string").slice(0, MAX_RECENT_SEARCHES));
      }
    } catch {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  const getSearchUrl = (service: string, city: string) => {
    const params = new URLSearchParams();
    if (service.trim()) params.set("service", service.trim());
    if (city.trim()) params.set("ville", city.trim());
    const query = params.toString();
    return query ? `/prestataires?${query}` : "/prestataires";
  };

  const saveRecentSearch = (service: string, city: string) => {
    if (!service.trim() && !city.trim()) return;
    const label = [service.trim(), city.trim()].filter(Boolean).join(" — ");
    const next = [label, ...recentSearches.filter((item) => item !== label)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(next);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveRecentSearch(searchService, searchCity);
    const target = getSearchUrl(searchService, searchCity);
    if (!isAuthenticated) {
      navigate(`/inscription-client?next=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  const handleRecentSearch = (label: string) => {
    const [service = "", city = ""] = label.split(" — ");
    setSearchService(service);
    setSearchCity(city);
    const target = getSearchUrl(service, city);
    if (!isAuthenticated) {
      navigate(`/inscription-client?next=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: palette.bg }}>
      <Header />


{/* ═══════ HERO ═══════ */}
<section
  className="relative overflow-hidden"
  style={{ background: "#F8F6F2" }}
>
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse 50% 45% at 20% 35%, rgba(61,122,95,0.10), transparent 70%), radial-gradient(ellipse 42% 40% at 82% 28%, rgba(193,122,82,0.08), transparent 72%)",
    }}
  />
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.02]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(44,48,56,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(44,48,56,0.5) 1px, transparent 1px)",
      backgroundSize: "36px 36px",
    }}
  />

  <div className="container mx-auto px-4 pt-12 pb-20 md:pt-36 md:pb-24 relative z-10">
    <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">
      {/* Left */}
      <div className="max-w-[580px]">
        <h1
          className="text-[38px] md:text-[52px] font-medium leading-[1.08] tracking-tight mb-5"
          style={{ fontFamily: "'DM Serif Display', serif", color: palette.heading }}
        >
          Trouvez un pro{" "}
          <span className="italic" style={{ color: palette.accent }}>
            indépendant
          </span>
          <br />
          pour chaque besoin
        </h1>

        <p
          className="text-[16px] md:text-[17px] leading-relaxed font-light mb-8 max-w-[460px]"
          style={{ color: palette.textLight }}
        >
          Comparez des profils vérifiés, consultez les avis et contactez directement le bon professionnel près de chez vous.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl p-2 shadow-[0_10px_36px_rgba(0,0,0,0.10)] flex flex-col md:flex-row gap-2 border"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <div
            className="flex items-center gap-3 flex-1 px-4 py-3.5 rounded-xl border border-transparent focus-within:border-[#D5E2DB]"
            style={{ background: "#F8F6F2" }}
          >
            <Search size={17} className="text-[#8A8E96] shrink-0" />
            <input
              type="text"
              placeholder="Plombier, électricien, peintre…"
              className="w-full bg-transparent outline-none placeholder:text-[#8A8E96] text-base md:text-sm"
              style={{ color: palette.heading }}
              value={searchService}
              onChange={(e) => setSearchService(e.target.value)}
            />
          </div>

          <div
            className="flex items-center gap-3 flex-1 px-4 py-3.5 rounded-xl border border-transparent focus-within:border-[#D5E2DB]"
            style={{ background: "#F8F6F2" }}
          >
            <MapPin size={17} className="text-[#8A8E96] shrink-0" />
            <input
              type="text"
              placeholder="Ville ou code postal"
              className="w-full bg-transparent outline-none placeholder:text-[#8A8E96] text-base md:text-sm"
              style={{ color: palette.heading }}
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 hover:translate-y-[-1px]"
            style={{ background: palette.accent, color: "#fff" }}
          >
            Rechercher
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Services cliquables */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          {(matchingHighlights.length ? matchingHighlights : serviceHighlights.slice(0, 6)).map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setSearchService(item.label)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition-all duration-200"
              style={{
                borderColor: "rgba(44,48,56,0.14)",
                color: palette.text,
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <span style={{ color: palette.accent }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right floating cards (conservées) */}
      <div className="hidden lg:block relative h-[420px]">
        <div className="absolute top-0 left-5 w-[260px] rounded-2xl p-6 bg-white border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full grid place-items-center text-white text-sm font-semibold" style={{ background: palette.accent }}>
              ML
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: palette.heading }}>Marc L.</div>
              <div className="text-xs font-light" style={{ color: palette.textLight }}>Particulier · Paris 11</div>
            </div>
          </div>
          <div className="flex gap-1 mb-2 text-[#C47A5A]">
            <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
          </div>
          <p className="text-[13px] italic leading-relaxed font-light" style={{ color: palette.text }}>
            « Intervention rapide et soignée. J'ai trouvé un plombier en 20 min. »
          </p>
        </div>

        <div className="absolute top-[140px] right-0 w-[240px] rounded-2xl p-6 bg-white border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium mb-3"
            style={{ color: palette.accent, background: "rgba(61,122,95,0.1)" }}
          >
            <Shield size={14} />
            Profil vérifié
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl leading-none" style={{ fontFamily: "'DM Serif Display', serif", color: palette.accent }}>4.9</span>
            <span className="text-xs font-light mb-1" style={{ color: palette.textLight }}>/ 5 — 127 avis</span>
          </div>
          <div className="text-[13px] mt-1 font-light" style={{ color: palette.text }}>Sophie B. · Électricienne</div>
        </div>

        <div className="absolute bottom-5 left-10 w-[280px] rounded-2xl p-6 bg-white border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: palette.accent }}>12k+</div>
              <div className="text-[11px] font-light" style={{ color: palette.textLight }}>Pros inscrits</div>
            </div>
            <div>
              <div className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: palette.accent }}>350+</div>
              <div className="text-[11px] font-light" style={{ color: palette.textLight }}>Villes couvertes</div>
            </div>
            <div>
              <div className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: palette.accent }}>98%</div>
              <div className="text-[11px] font-light" style={{ color: palette.textLight }}>Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      

      {/* ═══════ HOW IT WORKS ═══════ */}
<section className="py-20 md:py-24" style={{ background: palette.bgAlt }}>
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <span
        className="text-[11px] font-bold uppercase tracking-[3px] block mb-3"
        style={{ color: palette.terracotta }}
      >
        Comment ça marche
      </span>
      <h2
        className="text-3xl md:text-[36px] font-semibold leading-tight"
        style={{ fontFamily: "'DM Serif Display', serif", color: palette.heading }}
      >
        Une mise en relation simple et directe
      </h2>
      <p className="mt-3 text-[15px] font-light" style={{ color: palette.textLight }}>
        Vous décrivez, vous choisissez, le professionnel intervient. Nous facilitons la rencontre.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
      <div
        className="hidden md:block absolute top-12 left-[18%] right-[18%] h-px"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${palette.border} 0, ${palette.border} 8px, transparent 8px, transparent 16px)`,
        }}
      />

      {steps.map((step, i) => (
        <div key={i} className="text-center relative z-10">
          <div className="relative inline-flex mb-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: palette.accentLight }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                style={{ background: palette.accent }}
              >
                {step.icon}
              </div>
            </div>
            <span
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ background: palette.terracotta }}
            >
              {i + 1}
            </span>
          </div>

          <h3 className="font-bold text-lg mb-2" style={{ color: palette.heading }}>
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed font-light" style={{ color: palette.text }}>
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* ═══════ CATEGORIES ═══════ */}
   <section className="py-20 md:py-24" style={{ background: palette.bg }}>
  <div className="container mx-auto px-4">
    <div className="text-center mb-14">
      <span
        className="text-[11px] font-bold uppercase tracking-[3px] block mb-3"
        style={{ color: palette.terracotta }}
      >
        Catégories
      </span>
      <h2
        className="text-3xl md:text-[36px] font-semibold leading-tight"
        style={{ fontFamily: "'DM Serif Display', serif", color: palette.heading }}
      >
        Trouvez le bon professionnel par métier
      </h2>
      <p className="mt-3 text-[15px] font-light" style={{ color: palette.textLight }}>
        Des indépendants qualifiés dans tous les domaines du quotidien
      </p>
    </div>

    {/* Mobile carousel */}
    <div className="md:hidden">
      <div className="flex items-center justify-end gap-2 mb-3">
        <button
          type="button"
          onClick={() => scrollCategories("left")}
          className="w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-colors hover:border-[#3D7A5F]"
          style={{ borderColor: palette.border, color: palette.heading }}
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => scrollCategories("right")}
          className="w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-colors hover:border-[#3D7A5F]"
          style={{ borderColor: palette.border, color: palette.heading }}
          aria-label="Défiler vers la droite"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        ref={mobileCategoriesRef}
        className="-mx-4 px-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="inline-flex gap-3 pr-4">
          {categories.map((cat) => (
            <div key={cat.id} className="snap-start shrink-0 w-[170px]">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Desktop grid */}
    <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {visibleCategories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>

    {/* Desktop show more */}
    {categories.length > 8 && (
      <div className="hidden md:flex justify-center mt-8">
        <button
          type="button"
          onClick={() => setShowAllCategories((prev) => !prev)}
          className="px-5 py-2 rounded-full border text-sm font-semibold transition-colors hover:bg-[#0F1923] hover:text-[#E8C87A]"
          style={{ borderColor: palette.border, color: palette.heading, background: "#fff" }}
        >
          {showAllCategories ? "Voir moins" : "Voir plus"}
        </button>
      </div>
    )}
  </div>
</section>
      
      <div className="py-8" />
      
      {/* ═══════ PLATFORM EXPLAINER ═══════ */}
      <section className="py-20 md:py-24" style={{ background: palette.accent }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[3px] block mb-3 text-white/40">
                Notre rôle
              </span>
              <h2
                className="text-3xl md:text-[36px] font-semibold leading-tight text-white mb-4"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Nous facilitons la rencontre,
                <br />
                ils interviennent chez vous
              </h2>
              <p className="text-[15px] text-white/50 font-light leading-relaxed mb-10">
                PrestoServices est une plateforme de mise en relation. Les professionnels inscrits sont des indépendants : ils fixent leurs tarifs, gèrent leur planning et interviennent en direct.
              </p>

              <div className="space-y-6">
                {platformPoints.map((point, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-white/80">{point.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-white mb-1">{point.title}</h4>
                      <p className="text-[13px] text-white/45 font-light leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1] hover:-translate-y-1"
                  style={{ marginTop: i % 2 === 1 ? "20px" : "0" }}
                >
                  <div
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[12px] text-white/40 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    

      {/* ═══════ CITIES ═══════ */}
      <section className="py-20 md:py-24" style={{ background: palette.bgAlt }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span
              className="text-[11px] font-bold uppercase tracking-[3px] block mb-3"
              style={{ color: palette.terracotta }}
            >
              Couverture
            </span>
            <h2
              className="text-3xl md:text-[36px] font-semibold leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", color: palette.heading }}
            >
              Des professionnels dans toute la France
            </h2>
            <p className="mt-3 text-[15px] font-light" style={{ color: palette.textLight }}>
              Et la communauté grandit chaque jour
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city, i) => (
              <Link
                key={i}
                to={
                  isAuthenticated
                    ? `/prestataires?ville=${city.name}`
                    : `/inscription-client?next=${encodeURIComponent(`/prestataires?ville=${city.name}`)}`
                }
                className="group relative p-6 rounded-xl border text-center transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-md"
                style={{ background: palette.bg, borderColor: palette.border }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = palette.navy;
                  e.currentTarget.style.borderColor = palette.navy;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = palette.bg;
                  e.currentTarget.style.borderColor = palette.border;
                }}
              >
                <div
                  className="w-9 h-9 rounded-full border-2 mx-auto mb-3 flex items-center justify-center transition-colors duration-300"
                  style={{ borderColor: palette.accent, background: palette.accentLight }}
                >
                  <MapPin
                    size={14}
                    className="transition-colors duration-300"
                    style={{ color: palette.accent }}
                  />
                </div>
                <div
                  className="font-semibold text-sm transition-colors duration-300 group-hover:text-white"
                  style={{ color: palette.heading }}
                >
                  {city.name}
                </div>
                <div
                  className="text-xs mt-1 font-light transition-colors duration-300 group-hover:text-white/50"
                  style={{ color: palette.textLight }}
                >
                  {city.count.toLocaleString("fr-FR")} pros
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      
      <section className="py-6 md:py-8 bg-white">
  <div className="container mx-auto px-4">
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg border"
      style={{ borderColor: palette.border }}
    >
      {/* Triangles décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-40 h-40"
          style={{
            background: "rgba(255,255,255,0.10)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-24 w-28 h-28"
          style={{
            background: "rgba(255,255,255,0.08)",
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          }}
        />
        <div
          className="absolute top-6 right-8 w-20 h-20"
          style={{
            background: "rgba(255,255,255,0.12)",
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-36 h-36"
          style={{
            background: "rgba(255,255,255,0.10)",
            clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Particuliers */}
        <div className="p-6 md:p-14" style={{ background: palette.navy }}>
          <span className="inline-flex items-center text-[10px] uppercase tracking-[2px] px-2.5 py-1 rounded-full bg-white/10 text-white/75 mb-3">
            Particuliers
          </span>

          <h2
            className="text-[22px] md:text-[30px] font-semibold text-white mb-2 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Trouvez un professionnel
            <br />
            en toute confiance
          </h2>

          <p className="text-[13px] md:text-[14px] text-white/60 font-light leading-relaxed mb-6">
            Décrivez votre besoin, comparez les profils et contactez directement le bon prestataire.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              to={isAuthenticated ? "/prestataires" : `/inscription-client?next=${encodeURIComponent("/prestataires")}`}
              className="w-full sm:w-auto text-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: "#FFFFFF", color: palette.heading }}
            >
              Trouver un pro
            </Link>
            <Link
              to="/"
              className="hidden md:inline-flex px-5 py-3 rounded-xl text-sm font-medium border border-white/20 text-white/70 transition-all duration-200 hover:border-white/35 hover:text-white"
            >
              Comment ça marche
            </Link>
          </div>
        </div>

        {/* Professionnels */}
        <div className="p-6 md:p-14 relative" style={{ background: palette.accent }}>
          <div className="absolute top-0 left-0 w-px h-full bg-white/20 hidden md:block" />

          <span className="inline-flex items-center text-[10px] uppercase tracking-[2px] px-2.5 py-1 rounded-full bg-white/15 text-white/85 mb-3">
            Professionnels
          </span>

          <h2
            className="text-[22px] md:text-[30px] font-semibold text-white mb-2 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Développez votre activité
            <br />
            avec IciWork
          </h2>

          <p className="text-[13px] md:text-[14px] text-white/75 font-light leading-relaxed mb-6">
            Recevez des demandes qualifiées, gagnez en visibilité locale et remplissez votre planning.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/inscription-prestataire"
              className="w-full sm:w-auto text-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: "#FFFFFF", color: palette.heading }}
            >
              Créer mon profil
            </Link>
            <Link
              to="/"
              className="hidden md:inline-flex px-5 py-3 rounded-xl text-sm font-medium border border-white/25 text-white/80 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> 

      <div className="py-8 bg-white" />

      <Footer />
    </div>
  );
};

export default Index;
