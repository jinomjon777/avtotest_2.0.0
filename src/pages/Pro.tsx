import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Crown,
  Check,
  X,
  Star,
  Zap,
  ShieldCheck,
  Clock,
  BookOpen,
  PlayCircle,
  Database,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function Pro() {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();
  const { t } = useLanguage();

  const features = [
    { icon: Database,    textKey: "pro.feature1", desc: "1200+ ta savollar bazasidan istalgan variantni ishlang" },
    { icon: PlayCircle,  textKey: "pro.feature2", desc: "Barcha mavzular bo'yicha to'liq maxsus testlar" },
    { icon: BookOpen,    textKey: "pro.feature3", desc: "Imtihon qoidalari va yo'l belgilarini o'rganing" },
    { icon: Zap,         textKey: "pro.feature4", desc: "Admin ko'magi va premium guruh" },
    { icon: Clock,       textKey: "pro.feature5", desc: "Cheksiz vaqt va urinishlar" },
    { icon: ShieldCheck, textKey: "pro.feature6", desc: "Natijalaringizni kuzatib boring" },
    { icon: Star,        textKey: "pro.feature7", desc: "Yangi funksiyalarga birinchi bo'lib ega bo'ling" },
  ];

  const plans = [
    {
      nameKey:        "pro.planWeekly",
      price:          "15,000",
      periodKey:      "pro.planWeeklyDesc",
      descriptionKey: "pro.planWeeklyDesc",
      highlighted:    false,
      buttonTextKey:  "pro.planWeeklyButton",
    },
    {
      nameKey:        "pro.planMonthly",
      price:          "33,000",
      periodKey:      "pro.planMonthlyDesc",
      descriptionKey: "pro.planMonthlyDesc",
      highlighted:    true,
      buttonTextKey:  "pro.planMonthlyButton",
    },
    {
      nameKey:        "pro.planQuarterly",
      price:          "83,000",
      periodKey:      "pro.planQuarterlyDesc",
      descriptionKey: "pro.planQuarterlyDesc",
      highlighted:    false,
      buttonTextKey:  "pro.planQuarterlyButton",
    },
  ];

  const handleGetPro   = () => window.open('https://t.me/avtotestu_ad', '_blank');
  const handleTryNow   = () => navigate('/auth?trial=true');

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SEO
        title={t("pro.seoTitle")}
        description={t("pro.seoDescription")}
        path="/pro"
        keywords={t("pro.seoKeywords")}
      />

      {/* ─── PREMIUM Active Banner ─── */}
      {user && profile?.is_pro && (
        <div style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(217,119,6,0.08))", borderBottom: "1px solid rgba(217,119,6,0.25)" }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}>
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-amber-700 dark:text-amber-400 text-sm md:text-base">
                  {t("home.proStatusActive")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Barcha PREMIUM imkoniyatlar faol — testlarni boshlang!
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="ml-2 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all hover:scale-[1.03] flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}
              >
                Bosh sahifa →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO / MAIN SECTION ─── */}
      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

            {/* MOBILE: Plans first */}
            <div className="lg:hidden">
              <PlanCard plans={plans} t={t} handleGetPro={handleGetPro} handleTryNow={handleTryNow} />
            </div>

            {/* LEFT: Info (8/12) */}
            <div className="lg:col-span-8 space-y-7">

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4 border"
                  style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(217,119,6,0.08))", borderColor: "rgba(217,119,6,0.3)" }}>
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="font-bold uppercase text-[11px] tracking-widest premium-gradient-text">
                    {t("pro.statusBadge")}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 font-montserrat">
                      {t("pro.title")}{" "}
                      <span className="premium-gradient-text">{t("pro.titleHighlight")}</span>{" "}
                      {t("pro.titleSuffix")}
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                      {t("pro.subtitle")}
                    </p>
                  </div>
                  <button
                    className="hidden lg:flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-bold text-sm shadow-xl flex-shrink-0 transition-all hover:scale-105 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                    onClick={handleTryNow}
                  >
                    <Clock className="w-5 h-5" />
                    Sinab ko'rish (1 soat)
                  </button>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {/* VS badge */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center z-10 text-xs font-bold shadow-md bg-white dark:bg-card border border-border text-muted-foreground">
                  {t("pro.comparisonVs")}
                </div>

                {/* Basic */}
                <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
                    <h3 className="font-semibold text-muted-foreground text-sm text-center">{t("pro.comparisonTitle")}</h3>
                  </div>
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground font-medium">{t("pro.comparisonBasic1")}</span>
                    </div>
                    {[2,3,4,5].map(n => (
                      <div key={n} className="flex items-start gap-2.5 opacity-50">
                        <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm line-through">{t(`pro.comparisonBasic${n}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium */}
                <div className="rounded-2xl overflow-hidden shadow-xl relative"
                  style={{ border: "2px solid rgba(29,78,216,0.35)", background: "linear-gradient(135deg, rgba(29,78,216,0.04) 0%, rgba(217,119,6,0.04) 100%)" }}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #d97706, transparent)", transform: "translate(30%, -30%)" }} />
                  <div className="px-5 py-4 border-b"
                    style={{ borderColor: "rgba(29,78,216,0.2)", background: "linear-gradient(135deg, rgba(29,78,216,0.1), rgba(217,119,6,0.08))" }}>
                    <h3 className="font-bold text-sm text-center flex items-center justify-center gap-2 premium-gradient-text">
                      <Crown className="w-4 h-4 text-amber-500" /> {t("pro.comparisonProTitle")}
                    </h3>
                  </div>
                  <div className="p-5 space-y-3.5 relative z-10">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-foreground">{t(`pro.comparisonPro${n}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <button
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:border-blue-300 dark:hover:border-blue-700 bg-muted/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all text-foreground"
                onClick={handleGetPro}
              >
                <Send className="w-4 h-4" />
                {t("pro.contactButton")}
              </button>
            </div>

            {/* RIGHT: Plans (desktop sticky) */}
            <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
              <PlanCard plans={plans} t={t} handleGetPro={handleGetPro} handleTryNow={handleTryNow} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-amber-50/50 dark:from-gray-900 dark:to-gray-900 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border"
              style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.08), rgba(217,119,6,0.08))", borderColor: "rgba(29,78,216,0.2)" }}>
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-bold uppercase text-xs tracking-widest premium-gradient-text">PREMIUM Imkoniyatlar</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 font-montserrat">
              {t("pro.benefitsTitle")}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              PREMIUM obuna bilan barcha imkoniyatlardan to'liq foydalaning va muvaffaqiyatga erishing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const gradients = [
                "from-blue-500 to-blue-700",
                "from-violet-500 to-violet-700",
                "from-emerald-500 to-emerald-700",
                "from-amber-500 to-orange-600",
                "from-rose-500 to-rose-700",
                "from-cyan-500 to-cyan-700",
                "from-indigo-500 to-indigo-700",
              ];
              return (
                <div key={i}
                  className="group bg-white dark:bg-card rounded-2xl p-6 border border-gray-100 dark:border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.03), rgba(217,119,6,0.03))" }} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i] || gradients[0]} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1.5 text-sm relative z-10">{t(feature.textKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed relative z-10">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

/* ─── Plan Card Component ─── */
function PlanCard({ plans, t, handleGetPro, handleTryNow }: {
  plans: any[];
  t: (key: string) => string;
  handleGetPro: () => void;
  handleTryNow: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-sm">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-500" /> {t("pro.plansTitle")}
      </h2>

      <div className="space-y-3">
        {plans.map((plan, i) => (
          <div key={i}
            className={`relative p-4 rounded-xl transition-all ${
              plan.highlighted
                ? "border-2 shadow-lg"
                : "border border-border bg-muted/20 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
            style={plan.highlighted ? {
              borderColor: "rgba(29,78,216,0.5)",
              background: "linear-gradient(135deg, rgba(29,78,216,0.05), rgba(217,119,6,0.05))",
              boxShadow: "0 8px 24px rgba(29,78,216,0.12)"
            } : {}}
          >
            {plan.highlighted && (
              <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold shadow-sm"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}>
                {t("pro.planPopular")}
              </div>
            )}
            <div className="mb-2">
              <h3 className="font-bold text-sm">{t(plan.nameKey)}</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">{t(plan.descriptionKey)}</p>
            </div>
            <div className="flex items-end gap-1.5 mb-3">
              <span className="text-xl font-extrabold">{plan.price}</span>
              <span className="text-xs text-muted-foreground mb-0.5">so'm / {t(plan.periodKey)}</span>
            </div>
            <button
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 ${
                plan.highlighted ? "text-white shadow-md" : "bg-muted hover:bg-muted/70 text-foreground"
              }`}
              style={plan.highlighted ? { background: "linear-gradient(135deg, #1d4ed8, #d97706)" } : {}}
              onClick={handleGetPro}
            >
              {t(plan.buttonTextKey)}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
        {t("pro.planContactText")}{" "}
        <button onClick={handleGetPro} className="text-blue-500 hover:underline font-semibold">
          {t("pro.planContactLink")}
        </button>.
      </p>

      <button
        className="w-full mt-3 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 hover:scale-[1.01]"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        onClick={handleTryNow}
      >
        <Clock className="w-4 h-4" />
        Sinab ko'rish (1 soat)
      </button>
    </div>
  );
}
