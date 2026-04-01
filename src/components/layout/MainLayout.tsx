import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Menu, X, User, LogIn, Crown, Globe, ChevronDown, Home, Phone, BookOpen, Info, Car, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrialTimer } from "@/components/TrialTimer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => { document.body.style.overflow = originalOverflow; };
  }, [mobileMenuOpen]);

  const navLinks = useMemo(() => [
    { path: "/", label: t("nav.home") },
    { path: "/belgilar", label: t("home.btnBelgilar") },
    { path: "/contact", label: t("nav.contact") },
    { path: "/darslik", label: t("nav.darslik") },
    { path: "/qoshimcha", label: t("nav.qoshimcha") },
  ], [t]);

  const languages = useMemo(() => [
    { code: "uz-lat" as const, display: "UZ", label: t("nav.langLatin") },
    { code: "uz" as const, display: "ЎЗ", label: t("nav.langCyrillic") },
    { code: "ru" as const, display: "RU", label: t("nav.langRussian") },
  ], [t]);

  const currentLangDisplay = useMemo(
    () => languages.find((l) => l.code === language)?.display ?? "UZ",
    [languages, language]
  );

  const handleLanguageChange = useCallback((code: typeof language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  }, [setLanguage]);

  const isMavzuliSection = useMemo(
    () => location.pathname === '/mavzuli' || location.pathname.startsWith('/mavzuli/'),
    [location.pathname]
  );

  const getInitials = useCallback((name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }, []);

  if (isMavzuliSection) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ─── NAVBAR ─── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/98 shadow-xl shadow-primary/20 backdrop-blur-md"
          : "bg-primary shadow-lg"
      }`}>
        {/* Subtle gold accent line at top */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

        <div className="w-full px-3 sm:px-5 md:px-7 lg:px-10">
          <div className="flex justify-between items-center h-[60px]">

            {/* LEFT: Lang + Logo */}
            <div className="flex items-center gap-3 sm:gap-6">

              {/* Language selector */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 text-white/85 hover:text-white py-1.5 text-xs font-semibold transition-colors rounded-lg hover:bg-white/10 px-2"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="tracking-wider">{currentLangDisplay}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {langMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 overflow-hidden"
                    onMouseLeave={() => setLangMenuOpen(false)}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLanguageChange(l.code)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          language === l.code
                            ? "bg-primary/8 text-primary font-bold"
                            : "text-gray-700 hover:bg-gray-50 font-medium"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                {/* Logo icon (kichik doira ichida) */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-amber-400/40 transition-transform duration-200 group-hover:scale-105 overflow-hidden">
                  <img
                    src="/logo-premium.png"
                    alt="AVTOTEST PREMIUM Logo"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                    width="36"
                    height="36"
                  />
                </div>
                {/* Text logo (desktop) */}
                <div className="hidden md:flex flex-col leading-none">
                  <div className="flex items-baseline gap-0">
                    <span className="text-white font-extrabold text-[14px] tracking-tight font-montserrat">AVTO</span>
                    <span className="text-amber-400 font-extrabold text-[14px] tracking-tight font-montserrat">TEST</span>
                  </div>
                  <span className="text-amber-400/90 font-bold text-[9px] tracking-[0.18em] uppercase">— PREMIUM —</span>
                </div>
              </Link>
            </div>

            {/* CENTER + RIGHT: Nav links (desktop) */}
            <div className="hidden lg:flex items-center gap-0.5">
              <TrialTimer />
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-amber-400 bg-white/8 font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* PREMIUM button */}
              <Link to="/pro" className="ml-2">
                <button className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #1e40af 0%, #b45309 100%)" }} />
                  <Crown className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{t("nav.getPro")}</span>
                </button>
              </Link>

              {/* User */}
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/profile')}
                  className="ml-1.5 flex items-center gap-2 text-white hover:bg-white/10 rounded-xl h-9 px-3"
                >
                  <Avatar className="h-7 w-7 ring-2 ring-amber-400/60">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold">
                      {getInitials(profile?.full_name || profile?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden xl:block text-sm font-medium">
                    {profile?.full_name || profile?.username || t("nav.profile")}
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="ml-1.5 bg-white/12 hover:bg-white/20 text-white border border-white/20 font-semibold h-9 px-4 rounded-xl text-sm backdrop-blur-sm"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {t("nav.login")}
                </Button>
              )}
            </div>

            {/* Mobile right */}
            <div className="lg:hidden flex items-center gap-1.5">
              <TrialTimer />

              <Link to="/pro">
                <button className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}>
                  <Crown className="w-3.5 h-3.5" />
                  <span>PREMIUM</span>
                </button>
              </Link>

              {user ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-1"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-amber-400/60">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold">
                      {getInitials(profile?.full_name || profile?.username)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="bg-white/12 hover:bg-white/20 text-white border border-white/20 font-semibold px-3 h-8 text-xs rounded-lg"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  {t("nav.login")}
                </Button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE DRAWER ─── */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-[300px] z-50 animate-in slide-in-from-right duration-300"
            style={{ background: "linear-gradient(160deg, hsl(220,72%,18%) 0%, hsl(220,65%,12%) 100%)" }}>

            {/* Drawer header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-amber-400/40 overflow-hidden">
                  <img src="/logo-premium.png" alt="logo" className="w-8 h-8 object-contain" />
                </div>
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-0">
                    <span className="text-white font-extrabold text-sm font-montserrat">AVTO</span>
                    <span className="text-amber-400 font-extrabold text-sm font-montserrat">TEST</span>
                  </div>
                  <span className="text-amber-400/80 text-[9px] font-bold tracking-[0.18em] uppercase">— PREMIUM —</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User info */}
            {user && profile && (
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 bg-white/8 rounded-xl p-3">
                  <Avatar className="h-11 w-11 ring-2 ring-amber-400/50">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                      {getInitials(profile?.full_name || profile?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {profile?.full_name || profile?.username}
                    </p>
                    {profile?.username && profile?.full_name && (
                      <p className="text-xs text-white/50 truncate">@{profile.username}</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/profile')}
                  className="w-full mt-3 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm h-9 rounded-xl"
                  variant="outline"
                >
                  <User className="w-4 h-4 mr-1.5" />
                  {t("nav.profile")}
                </Button>
              </div>
            )}

            {/* Nav links */}
            <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
              {[
                { path: "/", label: t("nav.home"), icon: Home },
                { path: "/belgilar", label: t("home.btnBelgilar"), icon: Car },
                { path: "/contact", label: t("nav.contact"), icon: Phone },
                { path: "/darslik", label: t("nav.darslik"), icon: BookOpen },
                { path: "/qoshimcha", label: t("nav.qoshimcha"), icon: Info },
              ].map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                    location.pathname === path
                      ? "bg-white/15 text-white border border-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {/* Premium link */}
              <div className="pt-2 mt-2 border-t border-white/10">
                <Link
                  to="/pro"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.4) 0%, rgba(217,119,6,0.3) 100%)", border: "1px solid rgba(217,119,6,0.4)", color: "#fcd34d" }}
                >
                  <Crown className="w-4 h-4" />
                  {t("nav.getPro")}
                  <Sparkles className="w-3.5 h-3.5 ml-auto opacity-70" />
                </Link>
              </div>

              {!user && (
                <div className="pt-2">
                  <Button
                    onClick={() => navigate('/auth')}
                    className="w-full gap-2 bg-white text-primary hover:bg-white/90 font-bold rounded-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <main className="flex-1">{children}</main>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "linear-gradient(160deg, hsl(220,72%,16%) 0%, hsl(220,72%,12%) 100%)" }}>
        {/* Gold top line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-amber-400/40 overflow-hidden">
                  <img
                    src="/logo-premium.png"
                    alt="AVTOTEST PREMIUM Logo"
                    className="w-11 h-11 object-contain"
                    width="44" height="44"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-0">
                    <span className="font-extrabold text-white text-base font-montserrat">AVTO</span>
                    <span className="font-extrabold text-amber-400 text-base font-montserrat">TEST</span>
                  </div>
                  <span className="text-amber-400/80 text-[10px] font-bold tracking-[0.16em] uppercase">— PREMIUM —</span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-[240px]">
                {t("footer.aboutText")}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{t("footer.quickLinksTitle")}</h3>
              <div className="space-y-2.5">
                {navLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-white/50 hover:text-white transition-colors text-sm hover:translate-x-1 transition-transform"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{t("footer.contactTitle")}</h3>
              <div className="space-y-2.5 text-sm text-white/50">
                <p>{t("footer.telegramLabel")}</p>
                <p>{t("footer.botLabel")}</p>
                <p>{t("footer.workingHoursLabel")}</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/35 text-xs">{t("footer.copyright")}</p>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Barcha tizimlar ishlaydi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
