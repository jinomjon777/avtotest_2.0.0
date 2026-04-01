import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessState } from "@/hooks/useAccessState";
import { useState } from "react";
import {
  Play,
  ChevronDown,
  MonitorSmartphone,
  ShieldCheck,
  Trophy,
  User,
  BarChart3,
  BookOpen,
  Settings,
  Crown,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  BookMarked,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SiteNotificationBanner } from "@/components/SiteNotificationBanner";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function Home() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showProPopup, setShowProPopup] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isPremium, loading: accessLoading } = useAccessState();

  const features = [
    { icon: MonitorSmartphone, titleKey: "home.feature1Title", descKey: "home.feature1Desc", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.2)" },
    { icon: ShieldCheck,       titleKey: "home.feature2Title", descKey: "home.feature2Desc", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)" },
    { icon: Trophy,            titleKey: "home.feature3Title", descKey: "home.feature3Desc", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleProRoute = (route: string) => {
    if (accessLoading && user) { navigate(route); return; }
    if (user && isPremium) { navigate(route); }
    else { setShowProPopup(true); }
  };

  const handlePopupConfirm = () => { setShowProPopup(false); navigate('/pro'); };
  const handlePopupClose  = () => setShowProPopup(false);

  return (
    <MainLayout>
      <SiteNotificationBanner />
      <MobileAppBanner />
      <SEO
        title={t("home.seoTitle")}
        description={t("home.seoDescription")}
        path="/"
        keywords="avtotest premium, avtotest, onlayn test, prava test, prava olish, YHQ testlari, yo'l belgilari"
      />

      {/* ─── PREMIUM POPUP ─── */}
      {showProPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handlePopupClose} />
          <div
            className="relative rounded-3xl shadow-2xl max-w-sm w-full p-7 animate-in zoom-in-95 duration-200 border"
            style={{ background: "hsl(225,65%,14%)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <button
              onClick={handlePopupClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/8 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center gap-5">
              <div
                className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
              >
                <Crown className="w-9 h-9 text-white drop-shadow" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white mb-2">PREMIUM Kerak</h3>
                <p className="text-white/45 text-sm leading-relaxed">{t("home.proSubscribePopup")}</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handlePopupClose}
                  className="flex-1 h-11 rounded-xl border font-semibold text-sm text-white/60 hover:text-white/80 transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                >
                  Bekor qilish
                </button>
                <button
                  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
                  onClick={handlePopupConfirm}
                >
                  <Crown className="w-4 h-4" />
                  Premium olish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="relative min-h-[580px] md:min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <img
          srcSet="/hero-bg-640.webp 640w, /hero-bg-1024.webp 1024w, /hero-bg-1920.webp 1920w"
          sizes="100vw"
          src="/hero-bg-1920.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
          width="1920" height="1080"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,15,40,0.82) 0%, rgba(8,14,38,0.75) 50%, rgba(6,12,34,0.90) 100%)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glows */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(217,119,6,0.5) 0%, transparent 65%)" }} />
        <div className="absolute bottom-[-100px] left-[-80px] w-[380px] h-[380px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(29,78,216,0.6) 0%, transparent 65%)" }} />

        {/* Content */}
        <div className="relative w-full max-w-5xl mx-auto px-4 py-16 text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border text-white/85 text-xs font-bold tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {t("home.badge")}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[56px] font-black text-white mb-5 leading-tight drop-shadow-sm" style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.5px" }}>
            <span className="text-white">AVTOTEST </span>
            <span style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PREMIUM</span>
            <br className="hidden sm:block" />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold opacity-90">{t("home.heroSubtitle").split(" ").slice(0, 4).join(" ")}</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 max-w-lg sm:max-w-none mx-auto mb-12">

            {/* Test ishlash */}
            <Link to="/test-ishlash" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all hover:scale-[1.04] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 30px rgba(16,185,129,0.35)" }}
              >
                <Play className="w-4 h-4 fill-current flex-shrink-0" />
                {t("home.btnTest")}
              </button>
            </Link>

            {/* Variantlar */}
            <div className="relative w-full sm:w-auto">
              <span
                className="absolute -top-2.5 -right-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 uppercase tracking-wide"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)", boxShadow: "0 2px 8px rgba(29,78,216,0.4)" }}
              >
                PREMIUM
              </span>
              <button
                onClick={() => handleProRoute('/variant')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all hover:scale-[1.04] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)", boxShadow: "0 8px 30px rgba(29,78,216,0.4)" }}
              >
                <BookMarked className="w-4 h-4 flex-shrink-0" />
                {t("home.btnVariantlar")}
                <Lock className="w-3 h-3 opacity-60" />
              </button>
            </div>

            {/* Mavzuli test */}
            <div className="relative w-full sm:w-auto">
              <span
                className="absolute -top-2.5 -right-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 uppercase tracking-wide"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)", boxShadow: "0 2px 8px rgba(29,78,216,0.4)" }}
              >
                PREMIUM
              </span>
              <button
                onClick={() => handleProRoute('/mavzuli')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all hover:scale-[1.04] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", boxShadow: "0 8px 30px rgba(124,58,237,0.35)" }}
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                {t("home.btnMavzuli")}
                <Lock className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="inline-flex flex-wrap justify-center gap-0 rounded-2xl border overflow-hidden mx-auto"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            {[
              { value: "1200+", label: "Savollar", color: "#60a5fa" },
              { value: "61",    label: "Variant",  color: "#a78bfa" },
              { value: "24/7",  label: "Mavjud",   color: "#4ade80" },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center px-8 py-4 ${i < 2 ? "border-r" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
              style={{ background: "rgba(29,78,216,0.08)", color: "hsl(220,72%,40%)", borderColor: "rgba(29,78,216,0.12)" }}
            >
              <Sparkles className="w-3 h-3" />
              Nima uchun biz?
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {t("home.featuresTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = feature.border; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${feature.bg}`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at top right, ${feature.bg}, transparent)` }} />

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ background: feature.bg, border: `1px solid ${feature.border}` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PROFILE CARD (logged in) ─── */}
      {user && (
        <section className="pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ borderColor: "hsl(var(--border))" }}>
              {/* Header */}
              <div
                className="relative p-8 text-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(220,72%,18%) 0%, hsl(225,60%,26%) 100%)" }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
                  style={{ background: "radial-gradient(circle at top right, #fbbf24, transparent)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none"
                  style={{ background: "radial-gradient(circle at bottom left, #3b82f6, transparent)" }} />
                <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 shadow-xl" style={{ boxShadow: "0 0 0 4px rgba(217,119,6,0.35)" }}>
                  <AvatarFallback
                    className="text-white text-2xl font-bold"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}
                  >
                    {getInitials(profile?.full_name || profile?.username)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-extrabold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {profile?.full_name || profile?.username || t("nav.user")}
                </h3>
                {profile?.username && <p className="text-white/45 text-sm mt-1">@{profile.username}</p>}
                {profile?.is_pro && (
                  <span
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] font-bold border"
                    style={{ background: "rgba(217,119,6,0.2)", borderColor: "rgba(217,119,6,0.4)", color: "#fcd34d" }}
                  >
                    <Crown className="w-3 h-3" /> PREMIUM Foydalanuvchi
                  </span>
                )}
              </div>

              {/* Quick nav */}
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ background: "hsl(var(--card))" }}>
                {[
                  { icon: User,      label: t("home.profileProfil"),     nav: "/profile" },
                  { icon: BarChart3, label: t("home.profileStatistika"), nav: "/profile" },
                  { icon: BookOpen,  label: t("home.profileDarslik"),    nav: "/darslik" },
                  { icon: Settings,  label: t("home.profileSozlamalar"), nav: "/profile" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(item.nav)}
                    className="group flex flex-col items-center gap-2 py-5 rounded-2xl border transition-all hover:-translate-y-0.5"
                    style={{ background: "hsl(var(--muted)/0.3)", borderColor: "hsl(var(--border))" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(29,78,216,0.25)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))"; }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border"
                      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PREMIUM SECTION (non-subscribers) ─── */}
      {!(user && profile?.is_pro) && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border"
              style={{
                background: "linear-gradient(135deg, hsl(220,72%,14%) 0%, hsl(225,65%,20%) 55%, hsl(32,70%,18%) 100%)",
                borderColor: "rgba(217,119,6,0.2)",
              }}
            >
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-72 h-72 opacity-20 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, #f59e0b, transparent)", transform: "translate(35%, -35%)" }} />
              <div className="absolute bottom-0 left-0 w-56 h-56 opacity-15 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent)", transform: "translate(-35%, 35%)" }} />
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)", boxShadow: "0 20px 50px rgba(29,78,216,0.4)" }}
                    >
                      <Crown className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border"
                      style={{ background: "rgba(217,119,6,0.15)", borderColor: "rgba(217,119,6,0.3)", color: "#fcd34d" }}
                    >
                      <Sparkles className="w-3 h-3" />
                      PREMIUM
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {t("home.proSectionTitle")}
                    </h2>
                    <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                      {t("home.proSectionDesc")}
                    </p>

                    {/* Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                      {["1200+ savollar bazasi", "To'liq videodarsliklar", "61 ta variant test", "Admin ko'magi"].map((item) => (
                        <div key={item} className="flex items-center gap-2.5 text-white/75 text-sm">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)" }}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </div>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <Link to="/pro">
                        <button
                          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl transition-all hover:scale-[1.04] active:scale-[0.97]"
                          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 8px 25px rgba(245,158,11,0.4)" }}
                        >
                          <Zap className="w-4 h-4" />
                          {t("home.proGetButton")}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <p className="flex items-center gap-1.5 text-xs text-white/35">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Bepul 1 soat sinab ko'rish mavjud
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PREMIUM Active banner ─── */}
      {user && profile?.is_pro && (
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex items-center gap-4 rounded-2xl p-5 border"
              style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(217,119,6,0.08))", borderColor: "rgba(217,119,6,0.25)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}
              >
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">{t("home.proStatusActive")}</span>
              <Link to="/test-ishlash" className="ml-auto">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  Testni boshlash <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT (accordion) ─── */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
            <button
              onClick={() => setAboutOpen(!aboutOpen)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-bold text-base text-foreground" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {t("home.aboutTitle")}
              </span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${aboutOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${aboutOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="px-6 pb-6 space-y-4 text-muted-foreground text-sm leading-relaxed border-t pt-5" style={{ borderColor: "hsl(var(--border))" }}>
                <p>{t("home.aboutText1")}</p>
                <p>{t("home.aboutText2")}</p>
                <ul className="space-y-2.5 pt-1">
                  {[t("home.aboutList1"), t("home.aboutList2"), t("home.aboutList3")].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-foreground/75 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-1">{t("home.aboutText3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
