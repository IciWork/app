import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { getAuthSession } from "@/lib/auth";

// ═══════════════════════════════════════════════════════════════
// ICIWORK DASHBOARD v3 — Clean, mature, zero emoji
// Mobile-first with bottom nav · Pro aesthetic
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#F6F5F2",
  card: "#FFFFFF",
  dk: "#1B4332",
  dkL: "#2D6A4F",
  dkP: "#D8F3DC",
  dkM: "#EFF8F2",
  gold: "#C4960C",
  txt: "#111318",
  sub: "#6B7280",
  lt: "#9CA3AF",
  bdr: "#E5E7EB",
  bdrS: "#F3F4F6",
  grn: "#059669",
  grnBg: "#ECFDF5",
  red: "#DC2626",
  redBg: "#FEF2F2",
  blu: "#2563EB",
  bluBg: "#EFF6FF",
  org: "#D97706",
  orgBg: "#FFFBEB",
};

const USER = { prenom: "Amadou", ville: "Bordeaux" };
const STATS = { online: 47, demandes: 23 };

const DEMANDES = [
  { id: 1, titre: "Fuite robinet cuisine", cat: "Plomberie", statut: "live", date: "Il y a 2h", matchs: 4, urgence: true },
  { id: 2, titre: "Installer 3 prises salon", cat: "Électricité", statut: "devis", date: "Hier", devisRecus: 3, meilleurPrix: "180 €" },
  { id: 3, titre: "Repeindre chambre 14m²", cat: "Peinture", statut: "planifie", date: "25 fév", prestataire: "K. Diallo", rdv: "Lundi 10h" },
  { id: 4, titre: "Pose parquet salon", cat: "Sols", statut: "termine", date: "18 fév", prestataire: "S. Koné", montant: "850 €" },
];

const PRESTA = [
  { id: 1, nom: "Ibrahim D.", metier: "Plombier", note: 4.9, avis: 127, ini: "ID", dispo: "now", repond: "8 min", dist: "2.3 km", tarif: "40 €/h", ok: true, missions: 89 },
  { id: 2, nom: "Fatou S.", metier: "Électricienne", note: 4.8, avis: 89, ini: "FS", dispo: "now", repond: "12 min", dist: "3.1 km", tarif: "45 €/h", ok: true, missions: 64 },
  { id: 3, nom: "Moussa K.", metier: "Peintre", note: 4.7, avis: 203, ini: "MK", dispo: "1h", repond: "5 min", dist: "1.8 km", tarif: "35 €/h", ok: true, missions: 156 },
  { id: 4, nom: "Aïcha T.", metier: "Aide ménagère", note: 5.0, avis: 56, ini: "AT", dispo: "now", repond: "3 min", dist: "0.9 km", tarif: "25 €/h", ok: true, missions: 42 },
  { id: 5, nom: "Omar B.", metier: "Menuisier", note: 4.6, avis: 74, ini: "OB", dispo: "demain", repond: "20 min", dist: "5.2 km", tarif: "50 €/h", ok: false, missions: 31 },
];

const MSGS = [
  { id: 1, nom: "Ibrahim D.", ini: "ID", last: "Je peux passer dans 30 min, ça vous va ?", time: "5 min", unread: true, on: true },
  { id: 2, nom: "Moussa K.", ini: "MK", last: "Devis envoyé — 320 € TTC", time: "1h", unread: true, on: false },
  { id: 3, nom: "Aïcha T.", ini: "AT", last: "D'accord pour lundi 9h !", time: "Hier", unread: false, on: true },
];

const CATS = [
  { nom: "Plomberie", live: 12 },
  { nom: "Électricité", live: 8 },
  { nom: "Ménage", live: 15 },
  { nom: "Peinture", live: 6 },
  { nom: "Jardinage", live: 9 },
  { nom: "Déménagement", live: 7 },
  { nom: "Bricolage", live: 11 },
  { nom: "Serrurerie", live: 3 },
];

// ─── Icons SVG ───
const I = {
  search: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  home: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  plus: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  msg: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  bell: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  user: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bolt: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  star: (s=13) => <svg width={s} height={s} viewBox="0 0 24 24" fill="#D4A017" stroke="#D4A017" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  check: (s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  clock: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  pin: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  shield: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  send: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  cal: (s=13) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  grid: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  x: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ─── Pulse ───
function Pulse({ color = C.grn, size = 7 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "iciw-pulse 1.5s ease infinite", opacity: .35 }} />
      <span style={{ width: size, height: size, borderRadius: "50%", background: color }} />
    </span>
  );
}

// ─── Reveal ───
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: .1 });
    ref.current && o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(16px)", transition: `all .45s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>{children}</div>;
}

// ═══ MAIN ═══
export default function IciWork() {
  const session = getAuthSession();
  const firstName = session?.firstName?.trim() || USER.prenom;
  const [tab, setTab] = useState("home");
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [sFocus, setSFocus] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(false);
  const [chat, setChat] = useState(null);
  const [online, setOnline] = useState(STATS.online);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setOnline(p => p + (Math.random() > .5 ? 1 : -1)), 9000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const suggest = CATS.filter(c => search.length > 1 && c.nom.toLowerCase().includes(search.toLowerCase()));

  const statMap = {
    live: { label: "En recherche", c: C.grn, bg: C.grnBg },
    devis: { label: "Devis reçus", c: C.blu, bg: C.bluBg },
    planifie: { label: "Planifié", c: C.org, bg: C.orgBg },
    termine: { label: "Terminé", c: C.lt, bg: C.bdrS },
  };

  const unreadCount = MSGS.filter(m => m.unread).length;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.txt, paddingBottom: 80 }}>
      <Header />
      <style>{`header{border-bottom:none !important;}`}</style>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px" }}>

        {/* ═══ HOME TAB ═══ */}
        {tab === "home" && <>
          {/* Hero */}
          <Reveal>
            <section style={{ padding: "0 0 16px" }}>
              <div
                style={{
                  marginTop: 4,
                  position: "relative",
                  marginLeft: "calc(50% - 50vw)",
                  marginRight: "calc(50% - 50vw)",
                  width: "100vw",
                  overflow: "hidden",
                  boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                }}
              >
                <img
                  src="/images/client-hero.jpg"
                  alt="Prestataire à domicile"
                  style={{
                    width: "100%",
                    height: "min(72vh, 680px)",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,.18) 45%, rgba(0,0,0,0))",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    top: "42%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: 34 }}>
                    <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: isMobile ? "min(16vw, 72px)" : 42, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-.4px", lineHeight: 1.1 }}>
                      Bonjour {firstName}
                    </h1>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    background: C.card, borderRadius: 14,
                    border: `2px solid ${sFocus ? C.dk : C.bdr}`,
                    padding: "3px 3px 3px 14px",
                    transition: "all .2s",
                    boxShadow: sFocus ? `0 0 0 3px ${C.dkP}` : "0 1px 8px rgba(0,0,0,.04)",
                    maxWidth: 780,
                    margin: "0 auto",
                  }}>
                    <span style={{ color: sFocus ? C.dk : C.lt, transition: "color .2s", flexShrink: 0 }}>{I.search(18)}</span>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      onFocus={() => setSFocus(true)} onBlur={() => setTimeout(() => setSFocus(false), 150)}
                      placeholder="Quel service cherchez-vous ?"
                      style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: C.txt, padding: "11px 10px", fontFamily: "inherit" }}
                    />
                    <button style={{ background: C.dk, color: "#fff", border: "none", borderRadius: 11, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.background = C.dkL}
                      onMouseLeave={e => e.currentTarget.style.background = C.dk}
                    >Chercher</button>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexWrap: isMobile ? "nowrap" : "wrap",
                      justifyContent: isMobile ? "flex-start" : "center",
                      gap: 8,
                      maxWidth: isMobile ? "100%" : 880,
                      marginLeft: "auto",
                      marginRight: "auto",
                      overflowX: isMobile ? "auto" : "visible",
                      paddingBottom: isMobile ? 4 : 0,
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "none",
                    }}
                  >
                    {CATS.slice(0, 8).map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSearch(c.nom)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          background: "rgba(255,255,255,.9)",
                          border: "1px solid rgba(255,255,255,.95)",
                          borderRadius: 999,
                          padding: "7px 14px",
                          cursor: "pointer",
                          transition: "all .15s",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          fontFamily: "inherit",
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.txt,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.9)"; e.currentTarget.style.transform = "none"; }}
                      >
                        {c.nom}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {sFocus && suggest.length > 0 && (
                <div style={{ marginTop: 8, background: C.card, borderRadius: 12, border: `1px solid ${C.bdr}`, boxShadow: "0 12px 40px rgba(0,0,0,.1)", overflow: "hidden", zIndex: 50, position: "relative" }}>
                  {suggest.map((s, i) => (
                    <div key={i} style={{ padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background .1s", borderBottom: i < suggest.length - 1 ? `1px solid ${C.bdrS}` : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.dkM}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{s.nom}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.grn, fontWeight: 700 }}>
                        <Pulse color={C.grn} size={5} /> {s.live} dispo
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Reveal>

          {/* Section header */}
          <Reveal delay={.07}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: "-.2px" }}>Mes demandes</h2>
              <button style={{ background: "none", border: "none", color: C.dkL, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                Tout voir {I.arrow(12)}
              </button>
            </div>
          </Reveal>

          {/* Demandes */}
          <Reveal delay={.09}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {DEMANDES.map(d => {
                const s = statMap[d.statut];
                return (
                  <div key={d.id} style={{
                    background: C.card, borderRadius: 14, padding: "14px 16px",
                    border: `1.5px solid ${d.urgence ? C.red + "25" : C.bdr}`,
                    cursor: "pointer", transition: "all .15s",
                    display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.dk + "35"; e.currentTarget.style.boxShadow = "0 3px 16px rgba(0,0,0,.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = d.urgence ? C.red + "25" : C.bdr; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: s.c }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-.1px" }}>{d.titre}</span>
                        {d.urgence && <span style={{ fontSize: 9, fontWeight: 800, color: C.red, background: C.redBg, padding: "2px 6px", borderRadius: 4, letterSpacing: ".5px" }}>URGENT</span>}
                      </div>
                      <div style={{ fontSize: 12, color: C.sub }}>{d.cat} · {d.date}{d.prestataire ? ` · ${d.prestataire}` : ""}</div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {d.statut === "live" && <div style={{ fontSize: 12, fontWeight: 700, color: C.grn, display: "flex", alignItems: "center", gap: 4 }}><Pulse size={6} />{d.matchs} matchs</div>}
                      {d.statut === "devis" && <div><div style={{ fontSize: 12, fontWeight: 700, color: C.blu }}>{d.devisRecus} devis</div><div style={{ fontSize: 10, color: C.sub }}>dès {d.meilleurPrix}</div></div>}
                      {d.statut === "planifie" && <div style={{ fontSize: 11, fontWeight: 600, color: C.org, display: "flex", alignItems: "center", gap: 3 }}>{I.cal(11)} {d.rdv}</div>}
                      {d.statut === "termine" && <div style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{d.montant}</div>}
                      <span style={{ display: "inline-block", marginTop: 3, padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: s.bg, color: s.c }}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* New demand */}
          <Reveal delay={.11}>
            <button onClick={() => setModal(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              width: "100%", padding: 14, borderRadius: 12, border: `2px dashed ${C.bdr}`,
              background: "transparent", fontSize: 13, fontWeight: 600, color: C.sub,
              cursor: "pointer", transition: "all .15s", fontFamily: "inherit", marginBottom: 32,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.dk; e.currentTarget.style.color = C.dk; e.currentTarget.style.background = C.dkM; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.color = C.sub; e.currentTarget.style.background = "transparent"; }}
            >{I.plus(16)} Nouvelle demande</button>
          </Reveal>

          {/* Prestataires recommandés */}
          <Reveal delay={.13}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: "-.2px" }}>Recommandés pour vous</h2>
                <p style={{ fontSize: 12, color: C.sub, margin: "2px 0 0" }}>Temps de réponse moyen : 8 min</p>
              </div>
              <button style={{ background: "none", border: "none", color: C.dkL, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                Voir plus {I.arrow(12)}
              </button>
            </div>
          </Reveal>

          <Reveal delay={.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
              {PRESTA.slice(0, 4).map(p => (
                <div key={p.id} style={{
                  background: C.card, borderRadius: 14, padding: "16px 18px",
                  border: `1.5px solid ${C.bdr}`, cursor: "pointer", transition: "all .2s", position: "relative",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Dispo */}
                  <div style={{ position: "absolute", top: 12, right: 14, display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: p.dispo === "now" ? C.grn : C.sub }}>
                    {p.dispo === "now" && <Pulse color={C.grn} size={5} />}
                    {p.dispo === "now" ? "Disponible" : p.dispo === "1h" ? "Dans 1h" : "Demain"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: C.dk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{p.ini}</div>
                      {p.ok && <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: C.dk, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.check(9)}</div>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.nom}</div>
                      <div style={{ fontSize: 12, color: C.sub }}>{p.metier}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: C.sub, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, color: C.txt, fontWeight: 700 }}>{I.star(11)} {p.note} <span style={{ color: C.lt, fontWeight: 400 }}>({p.avis})</span></span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{I.clock(10)} {p.repond}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{I.pin(10)} {p.dist}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{I.shield(10)} {p.missions}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.bdrS}` }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: C.dk }}>{p.tarif}</span>
                    <button style={{ background: C.dk, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.dkL}
                      onMouseLeave={e => e.currentTarget.style.background = C.dk}
                    >Contacter</button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

        </>}

        {/* ═══ EXPLORE TAB ═══ */}
        {tab === "explore" && (
          <Reveal>
            <section style={{ padding: "28px 0" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.dk, marginBottom: 20 }}>Tous les prestataires</h1>

              <div style={{ background: `linear-gradient(135deg, ${C.dk}, ${C.dkL})`, borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  <Pulse color="#4ade80" size={8} />
                  <span>{PRESTA.filter(p => p.dispo === "now").length} disponibles maintenant</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Réponse moy. : 8 min</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PRESTA.map(p => (
                  <div key={p.id} style={{ background: C.card, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${C.bdr}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.dk + "35"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: C.dk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{p.ini}</div>
                      {p.dispo === "now" && <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: C.grn, border: "2px solid white" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{p.nom}</span>
                        {p.ok && <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.dk, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{I.check(8)}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: C.sub }}>{p.metier} · {p.dist}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, justifyContent: "flex-end" }}>{I.star(11)} {p.note}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.dk, marginTop: 2 }}>{p.tarif}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ═══ MESSAGES TAB ═══ */}
        {tab === "messages" && (
          <Reveal>
            <section style={{ padding: "28px 0" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.dk, marginBottom: 20 }}>Messages</h1>
              <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, overflow: "hidden" }}>
                {MSGS.map((m, i) => (
                  <div key={m.id} onClick={() => setChat(m)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    borderBottom: i < MSGS.length - 1 ? `1px solid ${C.bdrS}` : "none",
                    cursor: "pointer", transition: "background .1s",
                    background: m.unread ? C.dkM : "transparent",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = m.unread ? C.dkP : C.bdrS}
                    onMouseLeave={e => e.currentTarget.style.background = m.unread ? C.dkM : "transparent"}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: C.dk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{m.ini}</div>
                      {m.on && <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: C.grn, border: "2px solid white" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: m.unread ? 700 : 500, fontSize: 14 }}>{m.nom}</span>
                        <span style={{ fontSize: 11, color: C.lt }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize: 13, color: m.unread ? C.txt : C.sub, fontWeight: m.unread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.last}</div>
                    </div>
                    {m.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.dk, flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ═══ NOTIFS TAB ═══ */}
        {tab === "notifs" && (
          <Reveal>
            <section style={{ padding: "28px 0" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.dk, marginBottom: 20 }}>Notifications</h1>
              <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, overflow: "hidden" }}>
                {[
                  { titre: "Nouveau devis reçu", desc: "Ibrahim D. vous a envoyé un devis pour votre fuite", time: "Il y a 5 min", fresh: true },
                  { titre: "Prestataire disponible", desc: "3 plombiers sont disponibles dans votre zone", time: "Il y a 30 min", fresh: true },
                  { titre: "Mission terminée", desc: "N'oubliez pas de noter S. Koné pour la pose de parquet", time: "Hier", fresh: false },
                  { titre: "Bienvenue !", desc: "Votre compte IciWork est prêt. Postez votre première demande.", time: "26 fév", fresh: false },
                ].map((n, i) => (
                  <div key={i} style={{
                    padding: "14px 16px", display: "flex", gap: 12, cursor: "pointer",
                    borderBottom: i < 3 ? `1px solid ${C.bdrS}` : "none",
                    background: n.fresh ? C.dkM : "transparent", transition: "background .1s",
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: n.fresh ? C.dk : C.bdrS, color: n.fresh ? "#fff" : C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{I.bell(16)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{n.titre}</div>
                      <div style={{ fontSize: 12, color: C.sub }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: C.lt, marginTop: 4 }}>{n.time}</div>
                    </div>
                    {n.fresh && <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.dk, flexShrink: 0, marginTop: 6 }} />}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ═══ PROFILE TAB ═══ */}
        {tab === "profil" && (
          <Reveal>
            <section style={{ padding: "28px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: C.dk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 }}>{firstName[0]}</div>
                <div>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.dk, margin: 0 }}>{firstName}</h1>
                  <p style={{ fontSize: 13, color: C.sub, margin: "2px 0 0" }}>{USER.ville} · Membre depuis 2026</p>
                </div>
              </div>
              <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.bdr}`, overflow: "hidden" }}>
                {["Modifier le profil", "Mes favoris", "Historique", "Paramètres", "Aide & support", "Se déconnecter"].map((item, i) => (
                  <div key={i} style={{
                    padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: i < 5 ? `1px solid ${C.bdrS}` : "none",
                    cursor: "pointer", transition: "background .1s", fontSize: 14, fontWeight: 500,
                    color: item === "Se déconnecter" ? C.red : C.txt,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bdrS}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {item}
                    {item !== "Se déconnecter" && <span style={{ color: C.lt }}>{I.arrow(12)}</span>}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="iciw-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300,
        background: "rgba(255,255,255,.97)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.bdr}`,
        display: "flex", alignItems: "center", justifyContent: "space-around",
        height: 64, padding: "0 8px",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { key: "home", icon: I.home, label: "Accueil", badge: 0 },
          { key: "explore", icon: I.grid, label: "Explorer", badge: 0 },
          { key: "new", icon: I.plus, label: "", badge: 0, isCta: true },
          { key: "messages", icon: I.msg, label: "Messages", badge: unreadCount },
          { key: "notifs", icon: I.bell, label: "Notifs", badge: 1 },
        ].map(item => (
          <button key={item.key} onClick={() => item.key === "new" ? setModal(true) : setTab(item.key)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer", padding: "6px 12px",
            position: "relative", fontFamily: "inherit", transition: "all .15s",
            ...(item.isCta ? {
              width: 48, height: 48, borderRadius: 14, background: C.dk, color: "#fff", padding: 0,
              boxShadow: "0 2px 12px rgba(27,67,50,.3)", marginTop: -12,
            } : {}),
          }}>
            <span style={{ color: item.isCta ? "#fff" : tab === item.key ? C.dk : C.lt, transition: "color .15s" }}>
              {item.icon(item.isCta ? 22 : 21)}
            </span>
            {!item.isCta && <span style={{ fontSize: 10, fontWeight: 600, color: tab === item.key ? C.dk : C.lt, transition: "color .15s" }}>{item.label}</span>}
            {item.badge > 0 && <span style={{ position: "absolute", top: item.isCta ? -2 : 0, right: item.isCta ? -2 : 6, width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* ═══ QUICK MODAL ═══ */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "iciw-fade .15s ease" }}
          onClick={() => setModal(false)}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: C.card, borderRadius: "20px 20px 0 0", padding: "24px 20px 32px",
            width: "100%", maxWidth: 500, animation: "iciw-up .25s cubic-bezier(.16,1,.3,1)",
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.bdr, margin: "0 auto 18px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.dk }}>Nouvelle demande</h2>
              <button onClick={() => setModal(false)} style={{ background: C.bdrS, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: C.sub }}>{I.x(16)}</button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {["Plomberie", "Électricité", "Serrurerie", "Bricolage", "Ménage", "Peinture", "Jardinage", "Autre"].map((c, i) => (
                <button key={i} style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${C.bdr}`, background: C.card, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", color: C.txt }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.dk; e.currentTarget.style.background = C.dkM; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.background = C.card; }}
                >{c}</button>
              ))}
            </div>

            <textarea placeholder="Décrivez votre besoin en quelques mots…" style={{ width: "100%", height: 90, borderRadius: 12, border: `1.5px solid ${C.bdr}`, padding: 14, fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = C.dk}
              onBlur={e => e.target.style.borderColor = C.bdr}
            />

            <button style={{ width: "100%", marginTop: 14, padding: 14, borderRadius: 12, background: C.dk, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = C.dkL}
              onMouseLeave={e => e.currentTarget.style.background = C.dk}
            >{I.send(14)} Publier ma demande</button>
            <p style={{ textAlign: "center", fontSize: 11, color: C.lt, marginTop: 10 }}>Gratuit · Sans engagement · Réponse en quelques minutes</p>
          </div>
        </div>
      )}

      {/* ═══ CHAT OVERLAY ═══ */}
      {chat && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "iciw-fade .15s ease" }}
          onClick={() => setChat(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: C.card, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 500,
            height: "75vh", display: "flex", flexDirection: "column",
            animation: "iciw-up .25s cubic-bezier(.16,1,.3,1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: `1px solid ${C.bdrS}` }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.dk, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{chat.ini}</div>
                {chat.on && <span style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.grn, border: "2px solid white" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{chat.nom}</div>
                <div style={{ fontSize: 11, color: chat.on ? C.grn : C.lt, fontWeight: 600 }}>{chat.on ? "En ligne" : "Hors ligne"}</div>
              </div>
              <button onClick={() => setChat(null)} style={{ background: C.bdrS, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: C.sub }}>{I.x(16)}</button>
            </div>

            <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ alignSelf: "flex-end", background: C.dk, color: "#fff", padding: "10px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 14, maxWidth: "80%" }}>
                Bonjour, vous êtes disponible quand ?
              </div>
              <div style={{ alignSelf: "flex-start", background: C.bdrS, color: C.txt, padding: "10px 14px", borderRadius: "14px 14px 14px 4px", fontSize: 14, maxWidth: "80%" }}>
                {chat.last}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderTop: `1px solid ${C.bdrS}`, paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
              <input placeholder="Écrire…" style={{ flex: 1, border: `1.5px solid ${C.bdr}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = C.dk}
                onBlur={e => e.target.style.borderColor = C.bdr}
              />
              <button style={{ width: 40, height: 40, borderRadius: 10, border: "none", background: C.dk, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.send(14)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STYLES ═══ */}
      <style>{`
        @keyframes iciw-pulse { 0% { transform: scale(1); opacity: .35; } 70% { transform: scale(2.2); opacity: 0; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes iciw-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes iciw-fade { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${C.dkP}; color: ${C.dk}; }
        ::-webkit-scrollbar { width: 4px; height: 0; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.bdr}; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: ${C.lt}; }

        /* Hide bottom nav on desktop, hide desktop nav icons on mobile */
        @media (min-width: 769px) {
          .iciw-bottom-nav { display: none !important; }
        }
        @media (max-width: 768px) {
          .iciw-desk-nav button:not(:first-child):not(:last-child) { display: none; }
          h1 { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
}
