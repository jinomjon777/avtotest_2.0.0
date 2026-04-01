import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProAccess } from "@/hooks/useProAccess";
import { useTestSession } from "@/hooks/useTestSession";
import { SEO } from "@/components/SEO";
import { MavzuliTestInterface } from "@/components/MavzuliTestInterface";
import { User, LogIn, Home, Play, AlertTriangle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const topics = [
  { id: '31', name: { uz_lat: 'Barcha savollar', uz_cyr: 'Барча саволлар', ru: 'Все вопросы' } },
  { id: '35a', name: { uz_lat: "Yangi savollar1", uz_cyr: "Янги саволлар1", ru: "Новые вопросы1" } },
  { id: '35b', name: { uz_lat: "Yangi savollar2", uz_cyr: "Янги саволлар2", ru: "Новые вопросы2" } },
  { id: '1', name: { uz_lat: "Umumiy qoidalar", uz_cyr: "Умумий қоидалар", ru: "Общие правила" } },
  { id: '3', name: { uz_lat: "Ogohlantiruvchi belgilar", uz_cyr: "Огоҳлантирувчи белгилар", ru: "Предупреждающие знаки" } },
  { id: '4', name: { uz_lat: "Imtiyoz belgilar", uz_cyr: "Имтиёз белгилар", ru: "Знаки приоритета" } },
  { id: '5', name: { uz_lat: "Taqiqlovchi belgilar", uz_cyr: "Тақиқловчи белгилар", ru: "Запрещающие знаки" } },
  { id: '6', name: { uz_lat: "Buyuruvchi belgilar", uz_cyr: "Буюрувчи белгилар", ru: "Предписывающие знаки" } },
  { id: '7', name: { uz_lat: "Axborot ishora belgilari", uz_cyr: "Ахборот ишора белгилари", ru: "Информационные знаки" } },
  { id: '8', name: { uz_lat: "Qo'shimcha axborot belgilari", uz_cyr: "Қўшимча ахборот белгилари", ru: "Дополнительные информационные знаки" } },
  { id: '20', name: { uz_lat: "Chorrahalarda harakatlanish", uz_cyr: "Чорраҳаларда ҳаракатланиш", ru: "Движение на перекрестках" } },
  { id: '34', name: { uz_lat: "Teng ahamiyatli chorrahalar", uz_cyr: "Тенг аҳамиятли чорраҳалар", ru: "Равнозначные перекрестки" } },
  { id: '9', name: { uz_lat: "Yotiq chiziqlar 1", uz_cyr: "Ётиқ чизиқлар 1", ru: "Горизонтальная разметка 1" } },
  { id: '10', name: { uz_lat: "Yotiq va tik chiziqlar 2", uz_cyr: "Ётиқ ва тик чизиқлар 2", ru: "Горизонтальная и вертикальная разметка 2" } },
  { id: '11', name: { uz_lat: "Svetafor ishoralari", uz_cyr: "Светафор ишоралари", ru: "Сигналы светофора" } },
  { id: '12', name: { uz_lat: "Tartibga soluvchining ishoralari", uz_cyr: "Тартибга солувчининг ишоралари", ru: "Сигналы регулировщика" } },
  { id: '13', name: { uz_lat: "Ogohlantiruvchi va avariya ishoralari", uz_cyr: "Огоҳлантирувчи ва авария ишоралари", ru: "Предупредительные и аварийные сигналы" } },
  { id: '14', name: { uz_lat: "Yo'llarda harakatlanish", uz_cyr: "", ru: "Начало движения (Маневр)" } },
  { id: '15', name: { uz_lat: "Transport vositalarining joylashuvi", uz_cyr: "Йўлнинг қатнов қисмида транспорт воситаларининг жойлашуви", ru: "Расположение транспортных средств на проезжей части" } },
  { id: '16', name: { uz_lat: "Harakatlanish tezligi", uz_cyr: "Ҳаракатланиш тезлиги", ru: "Скорость движения" } },
  { id: '17', name: { uz_lat: "Quvib o'tish", uz_cyr: "Қувиб ўтиш", ru: "Обгон" } },
  { id: '18', name: { uz_lat: "To'xtash va to'xtab turish qoidalari 1", uz_cyr: "Тўхташ ва тўхтаб туриш қоидалари 1", ru: "Правила остановки и стоянки 1" } },
  { id: '19', name: { uz_lat: "To'xtash va to'xtab turish qoidalari 2", uz_cyr: "Тўхташ ва тўхтаб туриш қоидалари 2", ru: "Правила остановки и стоянки 2" } },
  { id: '33', name: { uz_lat: "Tartibga solinmagan chorrahada asosiy yo'l", uz_cyr: "Тартибга солинмаган чорраҳада асосий йўл", ru: "Главная дорога на нерегулируемом перекрестке" } },
  { id: '2', name: { uz_lat: "Haydovchining umumiy vazifalari", uz_cyr: "Ҳайдовчининг умумий вазифалари ва пиёдалар", ru: "Общие обязанности водителя и пешеходы" } },
  { id: '21', name: { uz_lat: "Piyodalar o'tish joylari va turar joylar", uz_cyr: "Пиёдалар ўтиш жойлари ва турар жой даҳаларида ҳаракатланиш", ru: "Пешеходные переходы и движение в жилых зонах" } },
  { id: '22', name: { uz_lat: "Temir yo'l kesishmalari va Avtomagistrallar", uz_cyr: "Темир йўл кесишмалари ва Автомагистраллар", ru: "Железнодорожные переезды и движение по автомагистралям" } },
  { id: '23', name: { uz_lat: "Yo'nalishli transport vositalarining imtiyozlari", uz_cyr: "Йўналишли транспорт воситаларининг имтиёзлари ва ташқи ёритиш", ru: "Преимущества маршрутных транспортных средств" } },
  { id: '24', name: { uz_lat: "Shatakka olish", uz_cyr: "Транспорт воситаларини шатакка олиш", ru: "Буксировка транспортных средств" } },
  { id: '25', name: { uz_lat: "Yo'l harakati xavfsizligini ta'minlash", uz_cyr: "Йўл ҳаракати хавфсизлигини таъминлаш", ru: "Обучение вождению" } },
  { id: '26', name: { uz_lat: "Odam va yuk tashish", uz_cyr: "Одам ва юк ташиш", ru: "Перевозка людей и грузов" } },
  { id: '27', name: { uz_lat: "Harakatlanish taqiqlanadigan vaziyatlar", uz_cyr: "Транспорт воситаларида ҳаракатланиш тақиқланадиган вазиятлар", ru: "Ситуации, когда запрещено движение транспортных средств" } },
  { id: '28', name: { uz_lat: "Harakat xavfsizligini ta'minlash 1", uz_cyr: "Ҳаракат хавфсизлигини таъминлаш 1", ru: "Обеспечение безопасности движения 1" } },
  { id: '29', name: { uz_lat: "Harakat xavfsizligini ta'minlash 2", uz_cyr: "Ҳаракат хавфсизлигини таъминлаш 2", ru: "Обеспечение безопасности движения 2" } },
  { id: '30', name: { uz_lat: "Birinchi tibbiy yordam", uz_cyr: "Биринчи тиббий ёрдам", ru: "Первая медицинская помощь" } },
];

const languages = [
  { id: "uz-lat" as const, label: "Lotin" },
  { id: "uz" as const, label: "Кирилл" },
  { id: "ru" as const, label: "Русский" },
];

const darkBg = "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)";

export default function MavzuliTestlar() {
  const mavzuliStorageKey = 'mavzuli_activeTest';

  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(mavzuliStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.testStarted && parsed.selectedTopic) {
          const testKey = `testState_mavzuli_${parsed.selectedTopic}`;
          if (!localStorage.getItem(testKey)) {
            localStorage.removeItem(mavzuliStorageKey);
            return { selectedTopic: null as string | null, testStarted: false, sessionId: null as string | null };
          }
          return { selectedTopic: parsed.selectedTopic as string, testStarted: true, sessionId: (parsed.sessionId ?? null) as string | null };
        }
      }
    } catch (e) { /* ignore */ }
    return { selectedTopic: null as string | null, testStarted: false, sessionId: null as string | null };
  };

  const initial = getInitialState();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(initial.selectedTopic);
  const [testStarted, setTestStarted] = useState(initial.testStarted);
  const [sessionId, setSessionId] = useState<string | null>(initial.sessionId);
  const [startError, setStartError] = useState<string | null>(null);
  const { user, profile, isLoading } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const { loading: accessLoading } = useProAccess('/pro', true);
  const { starting, startSession } = useTestSession();

  useEffect(() => {
    try {
      if (testStarted && selectedTopic) {
        localStorage.setItem(mavzuliStorageKey, JSON.stringify({ testStarted, selectedTopic, sessionId }));
      } else {
        localStorage.removeItem(mavzuliStorageKey);
      }
    } catch (e) { /* ignore */ }
  }, [testStarted, selectedTopic, sessionId]);

  const getTopicName = (topic: typeof topics[0]) => {
    const langKey = language === 'uz-lat' ? 'uz_lat' : language === 'uz' ? 'uz_cyr' : 'ru';
    return topic.name[langKey];
  };

  const handleStartTest = async () => {
    if (selectedTopic === null) return;
    setStartError(null);
    const result = await startSession({
      variant: parseInt(selectedTopic, 10) || 0,
      questionSource: `t${selectedTopic}.json`,
      isPremium: true,
    });
    if (!result.ok) {
      setStartError(result.error === 'no_premium_access' ? 'Bu mavzuni boshlash uchun PREMIUM obuna kerak.' : 'Serverga ulanishda xatolik. Qayta urinib ko\'ring.');
      return;
    }
    setSessionId(result.session?.sessionId ?? null);
    setTestStarted(true);
  };

  const handleMobileTopicTap = async (topicId: string) => {
    if (selectedTopic === topicId) await handleStartTest();
    else setSelectedTopic(topicId);
  };

  if (isLoading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: darkBg }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-sm text-white/40 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (testStarted && selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic)!;
    return (
      <MavzuliTestInterface
        onExit={() => { setTestStarted(false); setSelectedTopic(null); setSessionId(null); setStartError(null); }}
        topicId={selectedTopic}
        topicName={getTopicName(topic)}
        sessionId={sessionId}
        isPremiumSession={true}
      />
    );
  }

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
          <button onClick={() => navigate('/profile')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-white/70 max-w-[80px] truncate">{profile?.full_name || profile?.username || 'Profil'}</span>
          </button>
        ) : (
          <button onClick={() => navigate('/auth')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-white/60 text-xs border border-white/10 bg-white/5 hover:bg-white/10">
            <LogIn className="w-3.5 h-3.5" /> Kirish
          </button>
        )}
      </div>

      {/* Language */}
      <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={language === lang.id ? { background: "rgba(255,255,255,0.12)", color: "white" } : { color: "rgba(255,255,255,0.35)" }}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Selected topic */}
      <div
        className="rounded-2xl border p-4 min-h-[72px] flex items-center justify-center text-center"
        style={selectedTopic
          ? { background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)" }
          : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed" }
        }
      >
        {selectedTopic ? (
          <div className="text-sm font-bold text-blue-300 leading-snug">
            {getTopicName(topics.find(t => t.id === selectedTopic)!)}
          </div>
        ) : (
          <div className="text-xs text-white/25">
            {language === 'ru' ? 'Выберите тему справа' : language === 'uz' ? 'Ўнг томондан мавзу танланг' : 'O\'ng tomondan mavzu tanlang'}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: "∞", label: "Savollar", color: "#60a5fa" },
          { value: "60", label: "daqiqa", color: "#a78bfa" },
          { value: "80%", label: "O'tish balli", color: "#4ade80" },
        ].map(({ value, label, color }) => (
          <div key={label} className="rounded-xl p-2.5 text-center border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="text-lg font-black" style={{ color }}>{value}</div>
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
        disabled={selectedTopic === null || starting}
        className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-35 shadow-lg"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
      >
        {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
        {selectedTopic ? "Testni boshlash" : "Mavzuni tanlang"}
      </button>

      {/* Instructions */}
      <div className="rounded-xl p-3.5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Ko'rsatmalar</p>
        <ul className="space-y-1.5">
          {["Mavzu bo'yicha barcha savollar beriladi", "Har bir savol uchun javob tanlang", "Test tugagach natijani ko'ring"].map((instr, i) => (
            <li key={i} className="flex items-start gap-2 text-[10px] text-white/30">
              <span className="text-blue-400/60 mt-0.5">•</span>{instr}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title="Mavzuli testlar - YHQ bo'yicha mavzular"
        description="Yo'l harakati qoidalari bo'yicha mavzuli testlar."
        path="/mavzuli"
        keywords="mavzuli test, YHQ mavzulari, yo'l qoidalari"
      />

      <div className="min-h-screen" style={{ background: darkBg }}>
        {/* Dots pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        {/* ── Mobile Layout ── */}
        <div className="lg:hidden flex flex-col min-h-screen relative">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b px-4 py-3 backdrop-blur-md" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.35)" }}>
            <div className="flex items-center justify-between mb-3">
              <Link to="/">
                <button className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-medium transition-colors">
                  <Home className="w-4 h-4" /> Bosh sahifa
                </button>
              </Link>
              {user ? (
                <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 text-white/60 text-xs border border-white/10 px-2.5 py-1.5 rounded-lg bg-white/5">
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[70px] truncate">{profile?.full_name || profile?.username || 'Profil'}</span>
                </button>
              ) : (
                <button onClick={() => navigate('/auth')} className="flex items-center gap-1.5 text-white/60 text-xs border border-white/10 px-2.5 py-1.5 rounded-lg bg-white/5">
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
                  style={language === lang.id
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
              className="mb-3 rounded-2xl p-4 border text-center min-h-[60px] flex items-center justify-center"
              style={selectedTopic
                ? { background: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.3)" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed" }
              }
            >
              {selectedTopic ? (
                <div className="text-sm font-bold text-blue-300">{getTopicName(topics.find(t => t.id === selectedTopic)!)}</div>
              ) : (
                <div className="text-xs text-white/25">{language === 'ru' ? 'Выберите тему ниже' : language === 'uz' ? 'Қуйидан мавзу танланг' : 'Quyidan mavzu tanlang'}</div>
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
              disabled={selectedTopic === null || starting}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-35"
              style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
            >
              {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {selectedTopic ? "Testni boshlash" : "Mavzuni tanlang"}
            </button>
          </div>

          {/* Topic list mobile */}
          <div className="flex-1 px-4 py-4 pb-8 space-y-2 relative">
            <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">
              {language === 'ru' ? 'Темы' : language === 'uz' ? 'Мавзулар' : 'Mavzular'}
            </p>
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleMobileTopicTap(topic.id)}
                  className="w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium"
                  style={isSelected
                    ? { background: "rgba(59,130,246,0.15)", borderColor: "rgba(59,130,246,0.4)", color: "#93c5fd" }
                    : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }
                  }
                >
                  {getTopicName(topic)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop Layout ── */}
        <div className="hidden lg:flex h-screen overflow-hidden relative">
          {/* Left panel */}
          <div className="w-[28%] border-r flex flex-col overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
            <SidePanel />
          </div>

          {/* Right panel: topic grid */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white mb-1">
                {language === 'ru' ? 'Тематические тесты' : language === 'uz' ? 'Мавзули тестлар' : 'Mavzuli testlar'}
              </h1>
              <p className="text-sm text-white/30">
                {language === 'ru' ? 'Проверьте свои знания по темам' : language === 'uz' ? 'Мавзу бўйича билимингизни синанг' : 'Mavzu bo\'yicha bilimingizni sinang'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className="text-left px-5 py-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={isSelected
                      ? { background: "rgba(59,130,246,0.15)", borderColor: "rgba(59,130,246,0.4)", color: "#93c5fd" }
                      : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                    }}
                  >
                    <span className="text-sm font-semibold leading-snug">{getTopicName(topic)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
