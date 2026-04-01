import { useState } from "react";
import { Clock, ChevronDown, Shield, Bot, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function QuickContactLinks() {
  const [showTerms, setShowTerms] = useState(false);
  const { t } = useLanguage();

  const contactLinks = [
    {
      icon: Send,
      labelKey: "contact.telegram",
      value: "@avtotestu_ad2",
      href: "https://t.me/avtotestu_ad",
      gradient: "linear-gradient(135deg, #2AABEE, #1a8fcc)",
      glow: "rgba(42,171,238,0.25)",
    },
    {
      icon: Bot,
      labelKey: "contact.telegramBot",
      value: "@Avtotestubot",
      href: "https://t.me/Avtotestubot",
      gradient: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
      glow: "rgba(29,78,216,0.25)",
    },
    {
      icon: Bot,
      labelKey: "contact.maktabAvtoBot",
      value: "@avtotestu_ad",
      href: "https://t.me/avtotestu_ad",
      gradient: "linear-gradient(135deg, #7c3aed, #5b21b6)",
      glow: "rgba(124,58,237,0.25)",
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)" }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>
          {t("contact.quickTitle")}
        </h2>
        <p className="text-muted-foreground text-sm mt-1.5">
          {t("contact.quickSubtitle")}
        </p>
      </div>

      {/* Contact Links */}
      <div className="space-y-3 flex-1">
        {contactLinks.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--muted)/0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${item.glow}`;
                (e.currentTarget as HTMLElement).style.borderColor = item.glow;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ background: item.gradient }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {t(item.labelKey)}
                </p>
                <p className="font-bold text-foreground text-sm mt-0.5 group-hover:text-primary transition-colors truncate">
                  {item.value}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <Send className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" style={{ transform: "rotate(45deg)" }} />
              </div>
            </a>
          );
        })}

        {/* Working Hours */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4 border mt-1"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)/0.06), hsl(var(--primary)/0.02))",
            borderColor: "hsl(var(--primary)/0.15)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {t("contact.workingHours")}
            </p>
            <p className="font-bold text-foreground text-sm mt-0.5">
              {t("contact.workingHours24")}
            </p>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Terms */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
        <button
          onClick={() => setShowTerms(!showTerms)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary opacity-70" />
            {t("contact.termsTitle")}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showTerms ? "rotate-180" : ""}`}
          />
        </button>

        {showTerms && (
          <div className="px-5 pb-5 space-y-3 border-t bg-muted/20" style={{ borderColor: "hsl(var(--border))" }}>
            <p className="text-sm font-medium text-foreground pt-4">
              {t("contact.termsIntro")}
            </p>
            <ul className="space-y-2.5">
              {[t("contact.terms1"), t("contact.terms2"), t("contact.terms3")].map((term, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-[10px]">{i + 1}</span>
                  </div>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
