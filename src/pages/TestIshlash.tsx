import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessState } from "@/hooks/useAccessState";
import { useTestSession } from "@/hooks/useTestSession";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Home,
  Play,
  Clock,
  HelpCircle,
  CheckCircle,
  Crown,
  Loader2,
  AlertTriangle,
  ServerCrash,
  Zap,
} from "lucide-react";
import { TestInterfaceBase } from "@/components/TestInterfaceBase";
import { TestInterfaceCombined } from "@/components/TestInterfaceCombined";

const languages = [
  { id: "uz-lat" as const, label: "Lotin", file: "700baza2.json", proFile: "barcha.json" },
  { id: "uz" as const, label: "Кирилл", file: "700baza.json", proFile: "barcha.json" },
  { id: "ru" as const, label: "Русский", file: "700baza.json", proFile: "barcha.json" },
];

const FREE_VARIANT = 99;

export default function TestIshlash() {
  const testIshlashStorageKey = "testIshlash_activeTest";

  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(testIshlashStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.testStarted && parsed.activeSession) {
          const testStateKey: string | undefined = parsed.activeSession.testStateKey;
          if (testStateKey && !localStorage.getItem(testStateKey)) {
            localStorage.removeItem(testIshlashStorageKey);
            return { testStarted: false, activeSession: null, questionCount: 20 as 20 | 50 };
          }
          return {
            testStarted: true,
            activeSession: parsed.activeSession,
            questionCount: (parsed.questionCount || 20) as 20 | 50,
          };
        }
      }
    } catch (e) { /* ignore */ }
    return { testStarted: false, activeSession: null, questionCount: 20 as 20 | 50 };
  };

  const initial = getInitialState();
  const [testStarted, setTestStarted] = useState(initial.testStarted);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<{
    sessionId: string | null;
    isPremium: boolean;
    testStateKey?: string;
    dataFile?: string;
  } | null>(initial.activeSession);
  const [questionCount, setQuestionCount] = useState<20 | 50>(initial.questionCount as 20 | 50);

  useEffect(() => {
    try {
      if (testStarted && activeSession) {
        localStorage.setItem(testIshlashStorageKey, JSON.stringify({ testStarted, activeSession, questionCount }));
      } else {
        localStorage.removeItem(testIshlashStorageKey);
      }
    } catch (e) { /* ignore */ }
  }, [testStarted, activeSession, questionCount]);

  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { state: accessState, isPremium, loading: accessLoading, backendConfirmed } = useAccessState();
  const { starting, startSession } = useTestSession();

  const langConfig = languages.find((l) => l.id === language);
  const dataFile = isPremium ? (langConfig?.proFile || "barcha.json") : (langConfig?.file || "700baza2.json");
  const showProBanner = !isPremium && accessState !== "active_pro" && accessState !== "active_trial";

  const handleStart = async () => {
    setSessionError(null);
    const testStateKey =
      questionCount === 50
        ? `testState_combined_${questionCount}`
        : `testState_base_/${dataFile}_${questionCount}`;

    if (isPremium) {
      if (!backendConfirmed) {
        setSessionError("Serverga ulanib bo'lmadi. Iltimos, sahifani yangilang.");
        return;
      }
      const result = await startSession({ variant: user ? FREE_VARIANT : 0, questionSource: dataFile, isPremium: true });
      if (!result.ok) {
        if (result.error === "no_premium_access") {
          setSessionError("Premium test uchun PREMIUM obuna kerak.");
        } else if (result.error === "not_authenticated") {
          setSessionError("Iltimos, avval tizimga kiring.");
        } else {
          setSessionError("Serverga ulanishda xatolik. Qayta urinib ko'ring.");
        }
        return;
      }
      setActiveSession({ sessionId: result.session?.sessionId ?? null, isPremium: true, testStateKey, dataFile });
    } else {
      if (user && backendConfirmed) {
        const result = await startSession({ variant: FREE_VARIANT, questionSource: dataFile, isPremium: false });
        setActiveSession({ sessionId: result.ok ? (result.session?.sessionId ?? null) : null, isPremium: false, testStateKey, dataFile });
      } else {
        setActiveSession({ sessionId: null, isPremium: false, testStateKey, dataFile });
      }
    }
    setTestStarted(true);
  };

  const effectiveDataFile = testStarted && activeSession ? (activeSession.dataFile ?? dataFile) : dataFile;
  const dataSources = useMemo(() => [`/${effectiveDataFile}`], [effectiveDataFile]);

  if (testStarted && activeSession !== null) {
    if (questionCount === 50) {
      return (
        <TestInterfaceCombined
          onExit={() => { setTestStarted(false); setActiveSession(null); }}
          dataSources={dataSources}
          testName="Test (50 ta)"
          questionCount={50}
          timeLimit={50 * 60}
          randomize={true}
        />
      );
    }
    return (
      <TestInterfaceBase
        onExit={() => { setTestStarted(false); setActiveSession(null); }}
        dataSource={`/${effectiveDataFile}`}
        testName="Test (20 ta)"
        questionCount={20}
        timeLimit={25 * 60}
        randomize={true}
        variant={user ? FREE_VARIANT : 0}
        sessionId={activeSession.sessionId}
        isPremiumSession={activeSession.isPremium}
      />
    );
  }

  return (
    <>
      <SEO title="Test ishlash" description="YHQ imtihon testlari" path="/test-ishlash" />

      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)",
        }}
      >
        {/* Dots pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Header */}
        <header className="relative w-full border-b px-6 py-3 sticky top-0 z-20 backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 font-bold text-white/70 hover:text-white hover:bg-white/10">
                <Home className="w-4 h-4" /> Bosh sahifa
              </Button>
            </Link>
            <div className="flex bg-white/8 rounded-xl p-1 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === lang.id
                      ? "bg-white text-[#1E2350] shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="relative flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-5">

          {/* PREMIUM Banner */}
          {showProBanner && !accessLoading && (
            <Link
              to="/pro"
              className="group flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, rgba(217,119,6,0.15), rgba(29,78,216,0.15))",
                borderColor: "rgba(217,119,6,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.35)";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
              >
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-amber-400 font-bold text-base leading-tight">
                  PREMIUM VERSIYA <span className="text-amber-500">✦</span>
                </p>
                <p className="text-white/40 text-sm mt-0.5">
                  <span className="font-bold text-white/70">1200+</span> savol bilan imtihonga tayyor bo'ling
                </p>
              </div>
              <Zap className="w-4 h-4 text-amber-400/60 group-hover:text-amber-400 transition-colors flex-shrink-0" />
            </Link>
          )}

          {/* Server warning */}
          {!accessLoading && !backendConfirmed && isPremium === false && user && (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ background: "rgba(234,179,8,0.08)", borderColor: "rgba(234,179,8,0.2)" }}
            >
              <ServerCrash className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-300/80">
                Server bilan aloqa yo'q. Bepul rejimda test ishlash mumkin.
              </p>
            </div>
          )}

          {/* Session error */}
          {sessionError && (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300/80">{sessionError}</p>
            </div>
          )}

          {/* Main card */}
          <div
            className="rounded-3xl border overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              borderColor: "rgba(255,255,255,0.10)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
            }}
          >
            {/* Card header */}
            <div
              className="px-8 py-5 flex items-center gap-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)" }}
              >
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Test ishlash</h1>
                <p className="text-white/40 text-sm font-medium">
                  {questionCount} ta tasodifiy savol • {questionCount === 20 ? "25" : "50"} daqiqa
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Question count */}
              <div className="flex-1">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 text-center">
                  Savollar sonini tanlang
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {([20, 50] as const).map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className="relative py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-0.5"
                      style={{
                        borderColor: questionCount === num ? "#3b82f6" : "rgba(255,255,255,0.08)",
                        background: questionCount === num ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)",
                      }}
                    >
                      {questionCount === num && (
                        <div
                          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span
                        className="text-4xl font-black leading-none"
                        style={{ color: questionCount === num ? "#93c5fd" : "rgba(255,255,255,0.25)" }}
                      >
                        {num}
                      </span>
                      <span className="text-sm font-semibold text-white/40 mt-1">savollar</span>
                      <span className="text-xs text-white/25">{num === 20 ? "25 daqiqa" : "50 daqiqa"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats + button */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: HelpCircle, value: questionCount, label: "Savollar", color: "#60a5fa" },
                    { icon: Clock, value: questionCount === 20 ? 25 : 50, label: "Daqiqa", color: "#a78bfa" },
                    { icon: CheckCircle, value: "90%", label: "O'tish", color: "#4ade80" },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 rounded-2xl py-4"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-xl font-black leading-none text-white">{value}</span>
                      <span className="text-xs font-semibold text-white/30">{label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  disabled={starting || accessLoading}
                  className="w-full h-14 rounded-xl font-black text-white flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-xl mt-auto"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
                >
                  {starting || accessLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  {starting ? "Yuklanmoqda..." : "Testni boshlash"}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-white/20">
            Testni boshlash uchun ro'yxatdan o'tish shart emas
          </p>
        </main>
      </div>
    </>
  );
}
