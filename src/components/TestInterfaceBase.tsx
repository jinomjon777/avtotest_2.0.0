import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionNavigation } from "./QuestionNavigation";
import { TestResults } from "./TestResults";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTestResults } from "@/hooks/useTestResults";
import {
  getInitialTimeRemaining,
  getInitialStartedAt,
  getSavedTestState,
  clearTestState,
} from "@/lib/testPersistence";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, ChevronLeft, ChevronRight, X, Check, SkipForward } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

// Format 1: Original format with nested question/answers objects
interface QuestionDataFormat1 {
  id?: number;
  bilet_id?: number;
  question_id?: number;
  name?: string | null;
  question: {
    oz?: string;
    uz?: string;
    ru?: string;
  };
  photo?: string | null;
  image?: string | null;
  answers: {
    status: number;
    answer_id?: number;
    answer: {
      oz?: string[];
      uz?: string[];
      ru?: string[];
    };
  };
}

// Format 2: Simple format with choises array (700baza.json / 700baza2.json)
interface QuestionDataFormat2 {
  id: number;
  question: string;
  choises: Array<{
    text: string;
    answer: boolean;
  }>;
  image?: string;
}

// Format 3: New format (barcha.json)
interface QuestionDataFormat3 {
  task_info?: { global_id?: string; ticket_num?: number; order?: number };
  media_url?: string;
  content: {
    uz_lat?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
    uz_cyr?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
    ru?: { text: string; options: { id: number; text: string; is_correct: boolean }[] };
  };
}

interface Question {
  id: number;
  text: string;
  image?: string;
  correctAnswer: number;
  answers: { id: number; text: string }[];
}

interface TestInterfaceBaseProps {
  onExit: () => void;
  dataSource: string;
  testName: string;
  questionCount?: number;
  timeLimit?: number;
  randomize?: boolean;
  imagePrefix?: string;
  variant?: number;
  /** Backend session id returned by start_test_session RPC */
  sessionId?: string | null;
  /** Whether this is a premium session — controls fail-closed save behaviour */
  isPremiumSession?: boolean;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const TestInterfaceBase = ({
  onExit,
  dataSource,
  testName,
  questionCount = 20,
  timeLimit = 25 * 60,
  randomize = false,
  imagePrefix = "/images/",
  variant = 0,
  sessionId = null,
  isPremiumSession = false,
}: TestInterfaceBaseProps) => {
  const { t, questionLang } = useLanguage();
  const { user } = useAuth();
  const { saveTestResult } = useTestResults();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const storageKey = `testState_base_${dataSource}_${questionCount}`;
  // Init from endsAt so refresh doesn't reset the timer
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getInitialTimeRemaining(storageKey, timeLimit)
  );
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // Restored from localStorage so timeTaken stays accurate after refresh
  const [testStartTime] = useState(() => getInitialStartedAt(storageKey));
  const [resultSaved, setResultSaved] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  // Increment to restart the timer interval (used by onTryAgain)
  const [timerKey, setTimerKey] = useState(0);

  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Persist autoAdvance like language setting – survives page refresh
  const [autoAdvance, setAutoAdvance] = useState(() => {
    try { return localStorage.getItem('autoAdvance') === 'true'; } catch { return false; }
  });
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  // Fetch test data from JSON file

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(dataSource);
        
        if (!response.ok) {
          throw new Error(t("test.errorLoadingData"));
        }
        
        const jsonData = await response.json();
        
        // Handle different JSON structures
        let rawArray: any[] = [];
        if (jsonData.data && Array.isArray(jsonData.data)) {
          rawArray = jsonData.data;
        } else if (Array.isArray(jsonData)) {
          rawArray = jsonData;
        } else if (jsonData.questions && Array.isArray(jsonData.questions)) {
          rawArray = jsonData.questions;
        }
        
        if (rawArray.length === 0) {
          throw new Error(t("test.noQuestionsFound"));
        }

        // Randomize if needed and take only required count
        let selectedQuestions = randomize 
          ? shuffleArray(rawArray).slice(0, questionCount)
          : rawArray.slice(0, questionCount);

        // Transform JSON data to our Question format
        const transformedQuestions: Question[] = selectedQuestions.map((q, idx) => {
          // Format 3: New format (barcha.json) - check for content.uz_lat/uz_cyr/ru
          if (q.content && (q.content.uz_lat || q.content.uz_cyr || q.content.ru)) {
            const langKey = questionLang === 'oz' ? 'uz_lat' : questionLang === 'uz' ? 'uz_cyr' : 'ru';
            const langContent = q.content[langKey] || q.content.uz_lat || q.content.uz_cyr || q.content.ru;
            const correctOption = langContent.options.find((o: any) => o.is_correct);
            const correctAnswer = correctOption ? correctOption.id : 1;
            let imagePath: string | undefined;
            if (q.media_url?.trim()) {
              imagePath = q.media_url.startsWith('http') ? q.media_url : `${imagePrefix}${q.media_url}`;
            }
            return {
              id: idx + 1,
              text: langContent.text,
              image: imagePath,
              correctAnswer,
              answers: langContent.options.map((o: any) => ({ id: o.id, text: o.text })),
            };
          }
          
          // Format 2: Simple format with choises array (700baza.json / 700baza2.json)
          if (q.choises && Array.isArray(q.choises)) {
            const correctIndex = q.choises.findIndex((c: { answer: boolean }) => c.answer === true);
            // Handle media field: { exist: true, name: "1" } -> "/images/1.png"
            let imagePath: string | undefined;
            if (q.media?.exist && q.media?.name) {
              imagePath = `${imagePrefix}${q.media.name}.png`;
            } else if (q.image) {
              imagePath = `${imagePrefix}${q.image}`;
            }
            return {
              id: idx + 1,
              text: q.question,
              image: imagePath,
              correctAnswer: correctIndex + 1, // 1-indexed
              answers: q.choises.map((choice: { text: string }, ansIdx: number) => ({
                id: ansIdx + 1,
                text: choice.text,
              })),
            };
          }
          
          // Format 1: Original format with nested question/answers objects
          const typedQ = q as QuestionDataFormat1;
          const answerLang = questionLang as 'oz' | 'uz' | 'ru';
          const questionObj = typedQ.question;
          const answers = typedQ.answers?.answer?.[answerLang] || typedQ.answers?.answer?.uz || typedQ.answers?.answer?.oz || [];
          const questionText = typeof questionObj === 'string' ? questionObj : (questionObj?.[answerLang] || questionObj?.uz || questionObj?.oz || '');
          const photoField = typedQ.photo || typedQ.image;
          
          return {
            id: idx + 1,
            text: questionText,
            image: photoField ? `${imagePrefix}${photoField}` : undefined,
            correctAnswer: typedQ.answers?.status || 1,
            answers: answers.map((answerText, ansIdx) => ({
              id: ansIdx + 1,
              text: answerText,
            })),
          };
        });

        // Restore from localStorage – use saved questions to preserve randomisation
        const saved = getSavedTestState(storageKey);
        if (
          saved?.questions &&
          Array.isArray(saved.questions) &&
          saved.questions.length === questionCount
        ) {
          setQuestions(saved.questions as typeof transformedQuestions);
          setCurrentQuestion(saved.currentQuestion ?? 1);
          setSelectedAnswers((saved.selectedAnswers as Record<number, number>) ?? {});
          setCorrectAnswers((saved.correctAnswers as Record<number, boolean>) ?? {});
          setRevealedQuestions((saved.revealedQuestions as Record<number, boolean>) ?? {});
          // timeRemaining already initialised from endsAt via useState lazy init
        } else {
          setQuestions(transformedQuestions);
        }
      } catch (err: any) {
        console.error('Error fetching test data:', err);
        setError(err.message || t("test.errorLoadingData"));
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [dataSource, questionLang, t, questionCount, randomize, imagePrefix]);

  // Timer – restarted whenever timerKey changes (e.g. after onTryAgain)
  useEffect(() => {
    if (showResults) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerKey]);

  // Auto-finish when timer reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && !showResults && !loading && questions.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      clearTestState(storageKey);
      setShowResults(true);
    }
  }, [timeRemaining, showResults, loading, questions.length, storageKey]);

  // Cleanup auto-advance timeout on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Persist test state – save full questions array so randomisation is preserved on refresh
  useEffect(() => {
    if (questions.length === 0 || showResults) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        questions,
        currentQuestion,
        selectedAnswers,
        correctAnswers,
        revealedQuestions,
        endsAt: Date.now() + timeRemaining * 1000,
        startedAt: testStartTime,
      }));
    } catch { /* ignore quota errors */ }
  }, [questions, currentQuestion, selectedAnswers, correctAnswers, revealedQuestions, timeRemaining, showResults, storageKey, testStartTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuestions = questions.length;
  const question = questions[currentQuestion - 1];
  const isRevealed = revealedQuestions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const handleAnswerSelect = (answerId: number) => {
    if (isRevealed) return;
    
    const isCorrect = answerId === question.correctAnswer;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
    
    setCorrectAnswers(prev => ({
      ...prev,
      [currentQuestion]: isCorrect
    }));
    
    setRevealedQuestions(prev => ({
      ...prev,
      [currentQuestion]: true
    }));

    // Check if this was the last question - auto-submit after brief delay
    const answeredCount = Object.keys(selectedAnswers).length + 1; // +1 for current answer
    if (answeredCount >= totalQuestions) {
      // Clear timer and auto-submit after showing feedback
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        clearTestState(storageKey);
        setShowResults(true);
      }, 1500);
      return;
    }

    // Auto-advance to next question (only if enabled)
    if (autoAdvance && currentQuestion < totalQuestions) {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1));
      }, 1100);
    }
  };

  const handleSwipe = () => {
    const swipeThreshold = 60;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > swipeThreshold) {
      isSwiping.current = true;
      if (diff > 0 && currentQuestion < totalQuestions) {
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
        setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1));
      } else if (diff < 0 && currentQuestion > 1) {
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
        setCurrentQuestion(prev => Math.max(1, prev - 1));
      }
      setTimeout(() => { isSwiping.current = false; }, 100);
    } else {
      isSwiping.current = false;
    }
  };

  const getAnswerState = (answerId: number) => {
    if (!isRevealed || !question) return "default";
    if (answerId === question.correctAnswer) return "correct";
    if (answerId === selectedAnswer && answerId !== question.correctAnswer) return "incorrect";
    return "default";
  };

  const handleFinishTest = () => {
    setShowFinishDialog(true);
  };

  const confirmFinishTest = () => {
    setShowFinishDialog(false);
    if (timerRef.current) clearInterval(timerRef.current);
    clearTestState(storageKey);
    setShowResults(true);
  };

  const getTestStats = () => {
    let correct = 0;
    let incorrect = 0;
    
    Object.entries(correctAnswers).forEach(([_, isCorrect]) => {
      if (isCorrect) correct++;
      else incorrect++;
    });
    
    return { correct, incorrect };
  };

  // Save result when showing results — uses backend RPC which re-validates access
  useEffect(() => {
    if (showResults && user && !resultSaved && variant > 0) {
      const stats = getTestStats();
      const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
      // Pass sessionId + isPremiumSession so backend enforces access at submit time
      saveTestResult(variant, stats.correct, totalQuestions, timeTaken, sessionId, isPremiumSession);
      setResultSaved(true);
    }
  }, [showResults, user, resultSaved, variant]);

  // Show results screen
  if (showResults) {
    const stats = getTestStats();
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    
    return (
      <TestResults
        totalQuestions={totalQuestions}
        correctAnswers={stats.correct}
        incorrectAnswers={stats.incorrect}
        timeTaken={timeTaken}
        variant={variant}
        onBackToHome={onExit}
        onTryAgain={() => {
          // Reset state and re-fetch to get NEW random questions
          clearTestState(storageKey);
          setSelectedAnswers({});
          setCorrectAnswers({});
          setRevealedQuestions({});
          setCurrentQuestion(1);
          setTimeRemaining(timeLimit);
          setShowResults(false);
          setResultSaved(false);
          setTimerKey(k => k + 1); // restart timer interval
          setLoading(true);
          // Trigger re-fetch by calling fetchTestData again
          fetch(dataSource)
            .then(res => res.json())
            .then(jsonData => {
              let rawArray: any[] = [];
              if (jsonData.data && Array.isArray(jsonData.data)) {
                rawArray = jsonData.data;
              } else if (Array.isArray(jsonData)) {
                rawArray = jsonData;
              } else if (jsonData.questions && Array.isArray(jsonData.questions)) {
                rawArray = jsonData.questions;
              }
              
              let selectedQuestions = randomize 
                ? shuffleArray(rawArray).slice(0, questionCount)
                : rawArray.slice(0, questionCount);

              const transformedQuestions: Question[] = selectedQuestions.map((q, idx) => {
                // Format 3: barcha.json
                if (q.content && (q.content.uz_lat || q.content.uz_cyr || q.content.ru)) {
                  const langKey = questionLang === 'oz' ? 'uz_lat' : questionLang === 'uz' ? 'uz_cyr' : 'ru';
                  const langContent = q.content[langKey] || q.content.uz_lat || q.content.uz_cyr || q.content.ru;
                  const correctOption = langContent.options.find((o: any) => o.is_correct);
                  const correctAnswer = correctOption ? correctOption.id : 1;
                  let imagePath: string | undefined;
                  if (q.media_url?.trim()) {
                    imagePath = q.media_url.startsWith('http') ? q.media_url : `${imagePrefix}${q.media_url}`;
                  }
                  return {
                    id: idx + 1,
                    text: langContent.text,
                    image: imagePath,
                    correctAnswer,
                    answers: langContent.options.map((o: any) => ({ id: o.id, text: o.text })),
                  };
                }
                
                if (q.choises && Array.isArray(q.choises)) {
                  const correctIndex = q.choises.findIndex((c: { answer: boolean }) => c.answer === true);
                  let imagePath: string | undefined;
                  if (q.media?.exist && q.media?.name) {
                    imagePath = `${imagePrefix}${q.media.name}.png`;
                  } else if (q.image) {
                    imagePath = `${imagePrefix}${q.image}`;
                  }
                  return {
                    id: idx + 1,
                    text: q.question,
                    image: imagePath,
                    correctAnswer: correctIndex + 1,
                    answers: q.choises.map((choice: { text: string }, ansIdx: number) => ({
                      id: ansIdx + 1,
                      text: choice.text,
                    })),
                  };
                }
                
                const typedQ = q as QuestionDataFormat1;
                const answerLang = questionLang as 'oz' | 'uz' | 'ru';
                const questionObj = typedQ.question;
                const answers = typedQ.answers?.answer?.[answerLang] || typedQ.answers?.answer?.uz || typedQ.answers?.answer?.oz || [];
                const questionText = typeof questionObj === 'string' ? questionObj : (questionObj?.[answerLang] || questionObj?.uz || questionObj?.oz || '');
                const photoField = typedQ.photo || typedQ.image;
                
                return {
                  id: idx + 1,
                  text: questionText,
                  image: photoField ? `${imagePrefix}${photoField}` : undefined,
                  correctAnswer: typedQ.answers?.status || 1,
                  answers: answers.map((answerText, ansIdx) => ({
                    id: ansIdx + 1,
                    text: answerText,
                  })),
                };
              });
              setQuestions(transformedQuestions);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }}
      />
    );
  }

  const darkBg = "linear-gradient(135deg, hsl(220,72%,9%) 0%, hsl(225,65%,16%) 60%, hsl(220,60%,12%) 100%)";
  const isTimeLow = timeRemaining < 60;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: darkBg }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-base">{testName} {t("test.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: darkBg }}>
        <div className="rounded-2xl border p-8 max-w-md text-center" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-red-400 mb-6 text-base">{error}</p>
          <button
            onClick={onExit}
            className="h-11 px-6 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}
          >
            {t("test.goBack")}
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: darkBg }}>
        <div className="rounded-2xl border p-8 max-w-md text-center" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-white/40 mb-6 text-base">{t("test.noQuestionsFound")}</p>
          <button
            onClick={onExit}
            className="h-11 px-6 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #d97706)" }}
          >
            {t("test.goBack")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: darkBg }}>
      {/* Dots pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Header */}
      <header
        className="relative px-3 py-2 md:px-5 md:py-2.5 shrink-0 border-b"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white/40 hidden sm:inline">{testName}</span>
            {/* Timer */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
              style={isTimeLow
                ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }
                : { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }
              }
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-black tabular-nums">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {/* Auto-advance toggle */}
            <button
              onClick={() => setAutoAdvance(prev => {
                const next = !prev;
                try { localStorage.setItem('autoAdvance', String(next)); } catch {}
                return next;
              })}
              title={autoAdvance ? "Avto-o'tish yoqilgan" : "Avto-o'tish o'chirilgan"}
              className="h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={autoAdvance
                ? { background: "rgba(59,130,246,0.2)", borderColor: "rgba(59,130,246,0.4)", color: "#93c5fd" }
                : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }
              }
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Finish */}
            <button
              onClick={handleFinishTest}
              className="h-8 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all"
              style={{ background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.3)", color: "#4ade80" }}
            >
              {t("test.finish")}
            </button>

            {/* Exit */}
            <button
              onClick={onExit}
              className="h-8 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)", color: "#f87171" }}
            >
              {t("test.exit")}
            </button>
          </div>
        </div>
      </header>

      {/* Question Navigation */}
      <QuestionNavigation
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        answeredQuestions={selectedAnswers}
        correctAnswers={correctAnswers}
        onQuestionSelect={(num) => {
          if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
          setCurrentQuestion(num);
        }}
      />

      {/* Main Content */}
      <main
        className="relative flex-1 px-4 py-4 md:px-8 md:py-5 w-full overflow-y-auto"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; isSwiping.current = false; }}
        onTouchMove={(e) => { if (Math.abs(e.touches[0].clientX - touchStartX.current) > 30) isSwiping.current = true; }}
        onTouchEnd={(e) => { touchEndX.current = e.changedTouches[0].clientX; if (isSwiping.current) { e.preventDefault(); handleSwipe(); } }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Question counter */}
          <div className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">
            {t("test.question")} {currentQuestion} / {totalQuestions}
          </div>

          {/* Desktop: 60/40 split */}
          <div className="md:flex md:gap-6 md:items-start">
            {/* Left: Question + Answers */}
            <div className="md:w-[60%] md:flex-shrink-0">
              {/* Question card */}
              <div
                className="rounded-2xl border p-4 md:p-5 mb-4"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.09)" }}
              >
                <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                  {question.text}
                </p>
              </div>

              {/* Mobile image */}
              {question.image && (
                <div
                  className="md:hidden rounded-2xl border p-3 mb-4 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <button type="button" className="block w-full cursor-zoom-in focus:outline-none" onClick={() => setZoomImage(question.image!)}>
                    <img src={question.image} alt="Question illustration" className="w-full max-w-[300px] h-auto mx-auto object-contain rounded-xl" />
                  </button>
                </div>
              )}

              {/* Answers */}
              <div className="space-y-2.5">
                {question.answers.map((answer) => {
                  const state = getAnswerState(answer.id);
                  const isSelected = selectedAnswer === answer.id;

                  let btnStyle: React.CSSProperties;
                  let circleStyle: React.CSSProperties;

                  if (state === "correct") {
                    btnStyle = { background: "rgba(34,197,94,0.2)", borderColor: "rgba(34,197,94,0.5)", color: "#4ade80" };
                    circleStyle = { background: "rgba(34,197,94,0.3)", borderColor: "transparent" };
                  } else if (state === "incorrect") {
                    btnStyle = { background: "rgba(239,68,68,0.18)", borderColor: "rgba(239,68,68,0.45)", color: "#f87171" };
                    circleStyle = { background: "rgba(239,68,68,0.3)", borderColor: "transparent" };
                  } else if (isSelected) {
                    btnStyle = { background: "rgba(59,130,246,0.15)", borderColor: "rgba(59,130,246,0.4)", color: "#93c5fd" };
                    circleStyle = { background: "rgba(59,130,246,0.2)", borderColor: "rgba(59,130,246,0.4)" };
                  } else {
                    btnStyle = { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" };
                    circleStyle = { background: "transparent", borderColor: "rgba(255,255,255,0.2)" };
                  }

                  return (
                    <button
                      key={answer.id}
                      onClick={() => { if (!isSwiping.current) handleAnswerSelect(answer.id); }}
                      disabled={isRevealed}
                      className="w-full rounded-xl border text-left transition-all duration-200 flex items-center gap-3 px-4 py-3.5 hover:brightness-110 disabled:cursor-default"
                      style={btnStyle}
                    >
                      <div
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={circleStyle}
                      >
                        {state === "correct" && <Check className="w-4 h-4" style={{ color: "#4ade80" }} />}
                        {state === "incorrect" && <X className="w-4 h-4" style={{ color: "#f87171" }} />}
                      </div>
                      <span className="text-sm md:text-base font-medium leading-snug">{answer.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Desktop image */}
            {question.image && (
              <div className="hidden md:block md:w-[40%] md:flex-shrink-0">
                <div
                  className="rounded-2xl border overflow-hidden sticky top-4"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <button type="button" className="block w-full cursor-zoom-in focus:outline-none p-3" onClick={() => setZoomImage(question.image!)}>
                    <img src={question.image} alt="Question illustration" className="w-full h-auto object-contain rounded-xl max-h-[60vh]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer
        className="relative px-3 py-2.5 md:px-5 md:py-3 shrink-0 border-t"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            disabled={currentQuestion === 1}
            onClick={() => {
              if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
              setCurrentQuestion(prev => Math.max(1, prev - 1));
            }}
            className="h-10 px-4 rounded-xl border font-semibold text-sm flex items-center gap-1.5 transition-all disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            {t("test.previous")}
          </button>

          <div className="text-sm text-white/30 font-medium text-center">
            <span className="font-black text-white/70">{Object.keys(selectedAnswers).length}</span>
            <span> / {totalQuestions}</span>
          </div>

          <button
            disabled={currentQuestion === totalQuestions}
            onClick={() => {
              if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
              setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1));
            }}
            className="h-10 px-4 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all disabled:opacity-30 text-white"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)" }}
          >
            {t("test.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Finish Dialog */}
      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent
          className="max-w-md border"
          style={{ background: "hsl(225,65%,14%)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-white">{t("test.finishConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              {t("test.finishConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border text-white/70 hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
            >
              {t("test.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-bold text-white border-0"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
              onClick={confirmFinishTest}
            >
              {t("test.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImageLightbox imageUrl={zoomImage} onClose={() => setZoomImage(null)} />
    </div>
  );
};
