import { useMemo, useState } from "react";
import { providers, categories } from "@/lib/data";
import ProviderCard from "@/components/ProviderCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Star, MapPin, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type SortKey = "relevance" | "rating-desc" | "reviews-desc" | "name-asc";

const PER_PAGE = 9;

const Providers = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  const cities = useMemo(() => {
    const uniq = Array.from(new Set(providers.map((p) => p.city).filter(Boolean)));
    return uniq.sort((a, b) => a.localeCompare(b, "fr"));
  }, []);

  const filtered = useMemo(() => {
    const list = providers.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (p.rating < minRating) return false;
      if (selectedCity !== "all" && p.city !== selectedCity) return false;
      return true;
    });

    if (sortBy === "rating-desc") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews-desc") list.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));

    return list;
  }, [selectedCategory, minRating, selectedCity, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const resetFilters = () => {
    setSelectedCategory(null);
    setMinRating(0);
    setSelectedCity("all");
    setSortBy("relevance");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || minRating > 0 || selectedCity !== "all";

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const suffix = filtered.length > 1 ? "s" : "";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFFFF" }}>
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-10">
        <section className="rounded-2xl border p-5 md:p-7 mb-6" style={{ background: "#FFFFFF", borderColor: "#ECEAE5" }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
                style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#4A4F57" }}
              >
                <Sparkles size={14} />
                Sélection de prestataires vérifiés
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: "#1C1F23" }}>
                Trouvez votre prestataire idéal
              </h1>
              <p className="text-sm mt-2" style={{ color: "#8A8E96" }}>
                Parcourez des profils qualifiés, comparez rapidement et contactez le bon professionnel selon votre besoin.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col lg:flex-row lg:items-center gap-3">
            <select
              className="h-12 rounded-xl border bg-white px-4 pr-10 text-[14px] font-medium w-full lg:w-[320px]"
              style={{ borderColor: "#ECEAE5", color: "#1C1F23" }}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortKey);
                setCurrentPage(1);
              }}
            >
              <option value="relevance">Tri : Pertinence</option>
              <option value="rating-desc">Tri : Meilleure note</option>
              <option value="reviews-desc">Tri : Plus d'avis</option>
              <option value="name-asc">Tri : Nom A-Z</option>
            </select>

            <Button className="lg:hidden" style={{ background: "#3D7A5F", color: "#FFFFFF" }} onClick={() => setShowFilters(true)}>
              <SlidersHorizontal size={16} className="mr-2" />
              Filtres
            </Button>
          </div>
        </section>

        <div className="flex gap-8">
          {showFilters && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setShowFilters(false)} />}

          <aside
            className={`
              ${showFilters ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 fixed lg:static top-0 left-0 h-full lg:h-auto w-[86%] max-w-[340px] lg:w-72
              z-50 lg:z-auto bg-white lg:bg-transparent transition-transform duration-300
            `}
          >
            <div
              className="h-full lg:h-auto rounded-none lg:rounded-xl border-0 lg:border p-5 lg:sticky lg:top-24 overflow-y-auto"
              style={{ background: "#FFFFFF", borderColor: "#ECEAE5" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filtres avancés</h3>
                <button className="lg:hidden text-muted-foreground" onClick={() => setShowFilters(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Catégorie</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left text-sm px-3 py-2 rounded-md transition-colors"
                    style={{
                      background: !selectedCategory ? "#F8F6F2" : "transparent",
                      color: !selectedCategory ? "#1C1F23" : "#8A8E96",
                    }}
                  >
                    Toutes
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left text-sm px-3 py-2 rounded-md transition-colors"
                      style={{
                        background: selectedCategory === cat.id ? "#F8F6F2" : "transparent",
                        color: selectedCategory === cat.id ? "#1C1F23" : "#8A8E96",
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Ville</h4>
                <select
                  className="w-full h-10 rounded-md border bg-white px-3 text-sm"
                  style={{ borderColor: "#ECEAE5" }}
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Note minimale</h4>
                <div className="space-y-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setMinRating(r);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left text-sm px-3 py-2 rounded-md transition-colors"
                      style={{
                        background: minRating === r ? "#F8F6F2" : "transparent",
                        color: minRating === r ? "#1C1F23" : "#8A8E96",
                      }}
                    >
                      {r === 0 ? "Toutes" : `${r}+ ★`}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full" style={{ background: "#3D7A5F", color: "#FFFFFF" }} onClick={resetFilters}>
                <RotateCcw size={14} className="mr-2" />
                Réinitialiser
              </Button>
            </div>
          </aside>

          <section className="flex-1 min-w-0">
            <div className="sticky top-16 z-10 bg-white/95 backdrop-blur py-2 mb-4 border-b" style={{ borderColor: "#ECEAE5" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {filtered.length} prestataire{suffix} trouvé{suffix}
                </p>
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="px-2.5 py-1 rounded-full text-xs border" style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#1C1F23" }}>
                        {categories.find((c) => c.id === selectedCategory)?.name ?? selectedCategory}
                      </span>
                    )}
                    {selectedCity !== "all" && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs border inline-flex items-center gap-1"
                        style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#1C1F23" }}
                      >
                        <MapPin size={12} />
                        {selectedCity}
                      </span>
                    )}
                    {minRating > 0 && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs border inline-flex items-center gap-1"
                        style={{ background: "#F8F6F2", borderColor: "#ECEAE5", color: "#1C1F23" }}
                      >
                        <Star size={12} />
                        {minRating}+
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {paginated.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 rounded-full border"
                    style={{ borderColor: "#D8E4DD", color: "#3D7A5F", background: "#FFFFFF" }}
                    onClick={() => goToPage(safePage - 1)}
                    disabled={safePage === 1}
                  >
                    <ChevronLeft size={14} className="mr-1" />
                    Précédent
                  </Button>

                  <span className="text-sm px-3 py-2 rounded-full border" style={{ color: "#4A4F57", borderColor: "#ECEAE5", background: "#F8F6F2" }}>
                    Page {safePage} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 rounded-full border"
                    style={{ borderColor: "#D8E4DD", color: "#3D7A5F", background: "#FFFFFF" }}
                    onClick={() => goToPage(safePage + 1)}
                    disabled={safePage === totalPages}
                  >
                    Suivant
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 border border-dashed rounded-xl" style={{ borderColor: "#ECEAE5", background: "#FFFFFF" }}>
                <p className="text-foreground font-medium mb-1">Aucun prestataire trouvé</p>
                <p className="text-muted-foreground text-sm">Essaie d'élargir les filtres.</p>
                <Button className="mt-4" style={{ background: "#3D7A5F", color: "#FFFFFF" }} onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Providers;
