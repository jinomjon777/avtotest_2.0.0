import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, RotateCcw, Home, Star, Award } from "lucide-react";

interface TestResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: number; // in seconds
  variant: number;
  onBackToHome: () => void;
  onTryAgain: () => void;
}

export const TestResults = ({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  timeTaken,
  variant,
  onBackToHome,
  onTryAgain,
}: TestResultsProps) => {
  const { t } = useLanguage();

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  // 90% passing threshold
  const passed = score >= 90;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG circle progress
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)",
      }}
    >
      {/* Subtle background dots */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Score ring */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="80" cy="80" r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
              />
              <circle
                cx="80" cy="80" r={radius}
                fill="none"
                stroke={passed ? "#22c55e" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {passed ? (
                <Award className="w-8 h-8 text-amber-400 mb-0.5" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 mb-0.5" />
              )}
              <span
                className="text-3xl font-black"
                style={{ color: passed ? "#4ade80" : "#f87171" }}
              >
                {score}%
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mt-5">
            {t("results.title")}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {t("test.variant")} {variant}
          </p>

          {/* Pass / Fail badge */}
          <div
            className={`inline-flex items-center gap-2 mt-3 px-5 py-1.5 rounded-full text-sm font-bold border ${
              passed
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : "bg-red-500/15 text-red-400 border-red-500/30"
            }`}
          >
            {passed ? (
              <Star className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {passed ? t("results.passed") : t("results.failed")}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              icon: CheckCircle2,
              value: correctAnswers,
              label: t("results.correct"),
              color: "text-green-400",
              bg: "bg-green-500/15",
              border: "border-green-500/20",
            },
            {
              icon: XCircle,
              value: incorrectAnswers,
              label: t("results.incorrect"),
              color: "text-red-400",
              bg: "bg-red-500/15",
              border: "border-red-500/20",
            },
            {
              icon: Clock,
              value: formatTime(timeTaken),
              label: t("results.timeTaken"),
              color: "text-blue-400",
              bg: "bg-blue-500/15",
              border: "border-blue-500/20",
            },
          ].map(({ icon: Icon, value, label, color, bg, border }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-2xl p-4 text-center backdrop-blur-sm`}
            >
              <div
                className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-xl font-black text-white">{value}</div>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl font-semibold border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
            onClick={onBackToHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl font-bold text-white shadow-lg border-0"
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #d97706 100%)" }}
            onClick={onTryAgain}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("results.tryAgain")}
          </Button>
        </div>

      </div>
    </div>
  );
};
