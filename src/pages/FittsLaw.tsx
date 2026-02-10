import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Target, RotateCcw } from 'lucide-react';

const quizQuestions = [
  {
    scenario: 'You are designing a mobile checkout page.',
    question: 'Where should the primary "Place Order" button be placed?',
    options: [
      { label: 'A', text: 'Top right corner (Text link style)' },
      { label: 'B', text: 'Bottom of the screen (Full width, 48px height)' },
      { label: 'C', text: 'Middle of the screen (Small circular icon)' },
    ],
    correctAnswer: 'B',
    feedback: 'Correct! Placing the button at the bottom creates an "infinite target" (users can\'t overshoot it) and keeps it within easy thumb reach.',
  },
];

export default function FittsLaw() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [dotSize, setDotSize] = useState(60);
  const [clicks, setClicks] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const { addXP } = useGame();

  const moveDot = useCallback(() => {
    const newSize = Math.max(12, 60 - clicks * 8);
    setDotSize(newSize);
    setDotPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    });
    setStartTime(Date.now());
  }, [clicks]);

  const handleClick = () => {
    const elapsed = Date.now() - startTime;
    setTimes(prev => [...prev, elapsed]);
    setClicks(c => c + 1);
    addXP(10);

    if (clicks >= 6) {
      setPhase('done');
    } else {
      moveDot();
    }
  };

  const startGame = () => {
    setPhase('game');
    setClicks(0);
    setTimes([]);
    setDotSize(60);
    moveDot();
  };

  const avgTime = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Fitts's Law</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The time to acquire a target is a function of the <strong className="text-foreground">distance to</strong> and <strong className="text-foreground">size of</strong> the target.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 rounded-full bg-destructive animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold">The Target Game</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Click the red dot as fast as you can. It will get <strong className="text-foreground">smaller</strong> and move <strong className="text-foreground">further away</strong>. 
                  Feel the difference.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow"
                  data-insight="This button is large and centered — easy to click per Fitts's Law"
                >
                  Start Game
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-sm text-muted-foreground">Click {clicks + 1} of 7</span>
                <span className="font-mono text-sm text-primary">Avg: {avgTime}ms</span>
              </div>
              <div
                ref={areaRef}
                className="relative w-full aspect-[16/9] rounded-2xl bg-card border border-border overflow-hidden cursor-crosshair"
              >
                <motion.button
                  key={clicks}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute rounded-full bg-destructive hover:bg-destructive/80 transition-colors shadow-lg"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    left: `${dotPos.x}%`,
                    top: `${dotPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={handleClick}
                  data-insight={`Distance: ${Math.round(dotPos.x * 5)}px, Size: ${dotSize}px. Difficulty: ${dotSize < 25 ? 'High' : dotSize < 45 ? 'Medium' : 'Low'}`}
                />
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
                <h2 className="text-2xl font-bold">Did you feel the difference?</h2>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {times.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-secondary">
                      <p className="font-mono text-lg font-bold">{t}ms</p>
                      <p className="text-xs text-muted-foreground">Click {i + 1}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                  <p className="text-sm">
                    <strong className="text-primary">💡 Insight:</strong> Small targets require precision and slow you down. Large targets near your thumb (the "Prime Zone") make navigation effortless.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={startGame} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80">
                    <RotateCcw className="h-4 w-4" /> Play Again
                  </button>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow"
                  >
                    I Understand → Take Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <QuizModal lawId="fitts" lawName="Fitts's Law" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
