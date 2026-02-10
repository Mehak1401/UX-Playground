import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Zap, RotateCcw } from 'lucide-react';

const quizQuestions = [
  {
    scenario: 'Your analytics show users abandon a form after Step 2 of 4.',
    question: 'What does the Doherty Threshold suggest you investigate first?',
    options: [
      { label: 'A', text: 'Whether the form copy is confusing' },
      { label: 'B', text: 'Whether response times between steps exceed 400ms' },
      { label: 'C', text: 'Whether the Submit button is too small' },
    ],
    correctAnswer: 'B',
    feedback: 'Correct! The Doherty Threshold says response times over 400ms break the user\'s flow state. Check latency first — then UX copy.',
  },
];

export default function DohertyThreshold() {
  const [phase, setPhase] = useState<'intro' | 'slow' | 'fast' | 'done'>('intro');
  const [count, setCount] = useState(0);
  const [frustration, setFrustration] = useState(0);
  const [slowTime, setSlowTime] = useState(0);
  const [fastTime, setFastTime] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const startRef = useRef(Date.now());
  const { addXP } = useGame();

  const TOTAL = 8;

  const handleSlowClick = useCallback(() => {
    setShowButton(false);
    setFrustration(f => Math.min(100, f + 12));
    setTimeout(() => {
      const next = count + 1;
      setCount(next);
      if (next >= TOTAL) {
        setSlowTime(Date.now() - startRef.current);
        setCount(0);
        setFrustration(0);
        setPhase('fast');
        startRef.current = Date.now();
      }
      setShowButton(true);
    }, 1000);
  }, [count]);

  const handleFastClick = useCallback(() => {
    const next = count + 1;
    setCount(next);
    addXP(5);
    if (next >= TOTAL) {
      setFastTime(Date.now() - startRef.current);
      setPhase('done');
      addXP(30);
    }
  }, [count, addXP]);

  useEffect(() => {
    if (phase === 'slow' || phase === 'fast') {
      startRef.current = Date.now();
      setCount(0);
    }
  }, [phase]);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-6 w-6 text-warning" />
            <h1 className="text-3xl sm:text-4xl font-bold">Doherty Threshold</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Productivity soars when interactions stay under <strong className="text-foreground">400ms</strong>. Speed isn't a feature — it's a requirement.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
                <Zap className="h-10 w-10 text-warning" />
              </div>
              <h2 className="text-2xl font-bold">The Speed Trap</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click {TOTAL} buttons. First round is <strong className="text-destructive">painfully slow</strong>. Second round is <strong className="text-success">instant</strong>. Feel the difference.
              </p>
              <button onClick={() => setPhase('slow')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Round 1 (Slow)
              </button>
            </motion.div>
          )}

          {(phase === 'slow' || phase === 'fast') && (
            <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-muted-foreground">
                  {phase === 'slow' ? '🐌 Round 1: Slow (1s delay)' : '⚡ Round 2: Instant'}
                </span>
                <span className="font-mono text-sm text-primary">{count}/{TOTAL}</span>
              </div>

              {/* Frustration Meter (slow round only) */}
              {phase === 'slow' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Frustration Meter</span>
                    <span>{frustration}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, hsl(var(--warning)), hsl(var(--destructive)))` }}
                      animate={{ width: `${frustration}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${(count / TOTAL) * 100}%` }} />
              </div>

              <div className="flex items-center justify-center min-h-[200px]">
                {showButton && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={phase === 'slow' ? handleSlowClick : handleFastClick}
                    className={`px-12 py-6 rounded-2xl font-bold text-lg text-primary-foreground transition-all ${
                      phase === 'slow' ? 'bg-warning hover:bg-warning/90' : 'bg-success hover:bg-success/90 glow'
                    }`}
                    data-insight={phase === 'slow' ? 'Each click has a 1-second delay. Notice the frustration building.' : 'Instant response. Under 400ms. This is the flow state.'}
                  >
                    Click Me ({count + 1}/{TOTAL})
                  </motion.button>
                )}
                {!showButton && phase === 'slow' && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Waiting...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">Which felt better?</h2>
              <div className="grid sm:grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="font-mono text-2xl font-bold text-destructive">{(slowTime / 1000).toFixed(1)}s</p>
                  <p className="text-sm text-muted-foreground">Slow Round</p>
                </div>
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <p className="font-mono text-2xl font-bold text-success">{(fastTime / 1000).toFixed(1)}s</p>
                  <p className="text-sm text-muted-foreground">Fast Round</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> Speed isn't just a feature; it's a requirement. Stay under 400ms to keep users in the "flow state." Every millisecond matters.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setFrustration(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
                  <RotateCcw className="h-4 w-4" /> Play Again
                </button>
                <button onClick={() => setShowQuiz(true)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 glow">
                  I Understand → Take Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <QuizModal lawId="doherty" lawName="Doherty Threshold" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
