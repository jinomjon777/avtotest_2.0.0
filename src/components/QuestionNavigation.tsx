import { useRef, useEffect } from "react";

interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Record<number, number>;
  correctAnswers: Record<number, boolean>;
  onQuestionSelect: (questionNumber: number) => void;
}

export const QuestionNavigation = ({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  correctAnswers,
  onQuestionSelect,
}: QuestionNavigationProps) => {
  const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeButton = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const scrollLeft =
        buttonRect.left - containerRect.left - containerRect.width / 2 + buttonRect.width / 2 + container.scrollLeft;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [currentQuestion]);

  const getStyle = (questionNum: number): React.CSSProperties => {
    const isActive = currentQuestion === questionNum;
    const isAnswered = answeredQuestions[questionNum] !== undefined;
    const isCorrect = correctAnswers[questionNum];

    if (isActive) {
      return { background: "linear-gradient(135deg, #1d4ed8, #d97706)", color: "white", boxShadow: "0 2px 8px rgba(29,78,216,0.4)" };
    }
    if (isAnswered) {
      if (isCorrect === true) return { background: "rgba(34,197,94,0.25)", color: "#4ade80", borderColor: "rgba(34,197,94,0.4)" };
      if (isCorrect === false) return { background: "rgba(239,68,68,0.25)", color: "#f87171", borderColor: "rgba(239,68,68,0.4)" };
    }
    return { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.08)" };
  };

  return (
    <div
      className="py-2 shrink-0 border-b"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div
        ref={scrollRef}
        className="max-w-5xl mx-auto px-3 md:px-4 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-1.5 pb-0.5 min-w-max">
          {questions.map((questionNum) => {
            const isActive = currentQuestion === questionNum;
            return (
              <button
                key={questionNum}
                ref={isActive ? activeRef : null}
                onClick={() => onQuestionSelect(questionNum)}
                className="min-w-[32px] h-8 md:min-w-[34px] text-xs font-bold rounded-lg border transition-all duration-150 flex items-center justify-center"
                style={getStyle(questionNum)}
              >
                {questionNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
