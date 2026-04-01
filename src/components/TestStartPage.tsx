import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTestResults } from "@/hooks/useTestResults";
import { Home, Clock, CheckCircle, HelpCircle, User, LogIn, Play, AlertTriangle } from "lucide-react";

interface TestStartPageProps {
  onStartTest: (variant: number) => void;
  startError?: string | null;
}

const languages = [
  { id: "uz-lat" as const, label: "Lotin" },
  { id: "uz" as const, label: "Кирилл" },
  { id: "ru" as const, label: "Русский" },
];

const TOTAL_VARIANTS = 61;
const variants = Array.from({ length: TOTAL_VARIANTS }, (_, i) => i + 1);

const darkBg = "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)";

export const TestStartPage = ({ onStartTest, startError }: TestStartPageProps) => {
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile } = useAuth();
  const { getVariantStatus } = useTestResults();
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (selectedVariant !== null) onStartTest(selectedVariant);
  };

  const handleMobileVariantTap = (v: number) => {
    if (selectedVariant === v) onStartTest(v);
    else setSelectedVariant(v);
  };

  const getVariantStyle = (v: number) => {
    const status = getVariantStatus(v);
    const isSelected = selectedVariant === v;
    if (status === "success") {
      return isSelected
        ? { background: "rgba(34,197,94,0.25)", borderColor: "#22c55e", color: "#4ade80" }
        : { background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)", color: "#86efac" };
    }
    if (status === "failed") {
      return isSelected
        ? { background: "rgba(239,68,68,0.25)", borderColor: "#ef4444", color: "#f87171" }
        : { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5" };
    }
    return isSelected
      ? { background: "rgba(59,130,246,0.2)", borderColor: "#3b82f6", color: "#93c5fd" }
      : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" };
  };

  const SidePanel = () => (
    <div className="flex flex-col h-full gap-4 p-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link to="/">
          <button className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors">
            <Home className="w-4 h-4" /> Bosh sahifa
          </button>
        </Link>
        {user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-white/70 max-w-[80px] truncate">
              {profile?.full_name || profile?.username || "Profil"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white/60 hover:text-white/90 text-xs font-medium transition-colors border border-white/10 bg-white/5"
          >
            <LogIn className="w-3.5 h-3.5" /> Kirish
          </button>
        )}
      </div>

      {/* Language switcher */}
      <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={
              language === lang.id
                ? { background: "rgba(255,255,255,0.12)", color: "white" }
                : { color: "rgba(255,255,255,0.35)" }
            }
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Selected variant display */}
      <div
        className="rounded-2xl border p-5 text-center"
        style={
          selectedVariant
            ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }
            : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed" }
        }
      >
        {selectedVariant ? (
          <>
            <div className="text-5xl font-black text-blue-300 mb-1">{selectedVariant}</div>
            <div className="text-xs text-white/30">{t("test.variant")} {selectedVariant}</div>
          </>
        ) : (
          <div className="text-xs text-white/25 py-3">
            {language === "ru" ? "Выберите вариант справа" : language === "uz" ? "Ўнг томондан вариант танланг" : "O'ng tomondan variant tanlang"}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: HelpCircle, value: "20", label: t("test.questions"), color: "#60a5fa" },
          { icon: Clock, value: "30", label: t("test.minutes"), color: "#a78bfa" },
          { icon: CheckCircle, value: "90%", label: t("test.passingScore"), color: "#4ade80" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="rounded-xl p-2.5 text-center border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
            <div className="text-sm font-black text-white">{value}</div>
            <div className="text-[9px] text-white/30 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {startError && (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">{startError}</p>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStartTest}
        disabled={selectedVariant === null}
        className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-35 shadow-lg"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
      >
        <Play className="w-4 h-4 fill-current" />
        {selectedVariant ? t("test.startTest") : t("test.selectVariantFirst")}
      </button>

      {/* Instructions */}
      <div className="rounded-xl p-3.5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">{t("test.instructions")}</p>
        <ul className="space-y-1.5">
          {[t("test.instruction1"), t("test.instruction2"), t("test.instruction3")].map((instr, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] text-white/30">
              <span className="text-blue-400/60 mt-0.5">•</span>
              {instr}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: darkBg }}>
      {/* Dots pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      {/* ── Mobile Layout ── */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 border-b px-4 py-3 backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.35)" }}>
          <div className="flex items-center justify-between mb-3">
            <Link to="/">
              <button className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-medium transition-colors">
                <Home className="w-4 h-4" /> Bosh sahifa
              </button>
            </Link>
            {user ? (
              <button onClick={() => navigate("/profile")} className="flex items-center gap-1.5 text-white/60 text-xs border border-white/10 px-2.5 py-1.5 rounded-lg bg-white/5">
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] truncate">{profile?.full_name || profile?.username || "Profil"}</span>
              </button>
            ) : (
              <button onClick={() => navigate("/auth")} className="flex items-center gap-1.5 text-white/60 text-xs border border-white/10 px-2.5 py-1.5 rounded-lg bg-white/5">
                <LogIn className="w-3.5 h-3.5" /> Kirish
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all"
                style={
                  language === lang.id
                    ? { background: "rgba(59,130,246,0.2)", borderColor: "rgba(59,130,246,0.4)", color: "#93c5fd" }
                    : { background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile selected + start */}
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div
            className="mb-3 rounded-2xl p-4 border text-center"
            style={
              selectedVariant
                ? { background: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.3)" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed" }
            }
          >
            {selectedVariant ? (
              <>
                <div className="text-4xl font-black text-blue-300 mb-1">{selectedVariant}</div>
                <div className="text-xs text-white/30">{t("test.variant")} {selectedVariant}</div>
              </>
            ) : (
              <div className="text-xs text-white/25 py-2">
                {language === "ru" ? "Выберите вариант ниже" : language === "uz" ? "Қуйидан вариант танланг" : "Quyidan variant tanlang"}
              </div>
            )}
          </div>
          {startError && (
            <div className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{startError}</p>
            </div>
          )}
          <button
            onClick={handleStartTest}
            disabled={selectedVariant === null}
            className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-35"
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
          >
            <Play className="w-4 h-4 fill-current" />
            {selectedVariant ? t("test.startTest") : t("test.selectVariantFirst")}
          </button>
        </div>

        {/* Stats row mobile */}
        <div className="grid grid-cols-3 gap-2 p-4">
          {[
            { value: "20", label: t("test.questions"), color: "#60a5fa" },
            { value: "30", label: t("test.minutes"), color: "#a78bfa" },
            { value: "90%", label: t("test.passingScore"), color: "#4ade80" },
          ].map(({ value, label, color }) => (
            <div key={label} className="rounded-xl p-2.5 text-center border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="text-lg font-black" style={{ color }}>{value}</div>
              <div className="text-[9px] text-white/30 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Mobile variant grid */}
        <div className="flex-1 px-4 pb-8">
          <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">{t("test.selectVariant")}</p>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => handleMobileVariantTap(v)}
                className="h-12 rounded-xl text-sm font-bold border transition-all"
                style={getVariantStyle(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30 inline-block" /> ≥90%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30 inline-block" /> &lt;90%</span>
          </div>
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left panel */}
        <div
          className="w-[28%] border-r flex flex-col overflow-y-auto"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}
        >
          <SidePanel />
        </div>

        {/* Right panel: variant grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white mb-1">{t("test.selectVariant")}</h1>
            <p className="text-sm text-white/30">
              {language === "ru" ? "Выберите вариант теста для начала" : language === "uz" ? "Тест вариантини танланг" : "Test variantini tanlang"}
            </p>
          </div>

          <div className="grid grid-cols-10 gap-2.5 mb-5">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(v)}
                className="h-12 rounded-xl text-sm font-bold border transition-all hover:scale-105 active:scale-95"
                style={getVariantStyle(v)}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs text-white/25">
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-green-500/15 border border-green-500/25 inline-block" /> ≥ 90% (o'tilgan)</span>
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-red-500/15 border border-red-500/25 inline-block" /> &lt; 90% (o'tilmagan)</span>
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded border border-blue-500/40 inline-block" style={{ background: "rgba(59,130,246,0.12)" }} /> Tanlangan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
