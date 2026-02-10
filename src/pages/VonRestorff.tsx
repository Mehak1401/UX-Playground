import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Eye, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const quizQuestions = [
  {
    scenario: 'You are designing a SaaS pricing page with 3 tiers.',
    question: 'Which element is using the Von Restorff Effect to drive conversions?',
    options: [
      { label: 'A', text: 'The header text that says "Pricing"' },
      { label: 'B', text: 'The "Best Value" card with a colored border and badge, slightly larger than the others' },
      { label: 'C', text: 'The footer disclaimer text in small print' },
    ],
    correctAnswer: 'B',
    feedback: 'The "Best Value" card differs from its siblings in size, color, and labeling — making it the most memorable and likely to be clicked.',
  },
];

export default function VonRestorff() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [clicked, setClicked] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useGame();

  const specialIndex = 12;

  const handleClick = (index: number) => {
    setClicked(index);
    if (index === specialIndex) {
      addXP(50);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }
    setTimeout(() => setPhase('done'), 800);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Von Restorff Effect</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            When multiple similar objects are present, the one that <strong className="text-foreground">differs</strong> is most likely to be remembered.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Eye className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Isolation Game</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You'll see a grid of shapes. Click the one that stands out. It's instinctive — and that's the point.
              </p>
              <button onClick={() => setPhase('game')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-center text-sm text-muted-foreground mb-6">Click the element that catches your eye</p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-4 max-w-2xl mx-auto">
                {Array.from({ length: 21 }).map((_, i) => {
                  const isSpecial = i === specialIndex;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleClick(i)}
                      className={`aspect-square rounded-${isSpecial ? 'xl' : 'full'} transition-all duration-200 ${
                        isSpecial
                          ? 'bg-primary glow animate-pulse-glow'
                          : 'bg-muted-foreground/20 hover:bg-muted-foreground/30'
                      } ${clicked === i ? (isSpecial ? 'ring-4 ring-primary/50' : 'ring-4 ring-destructive/50 animate-shake') : ''}`}
                      data-insight={isSpecial ? 'This element differs in shape, color, and animation — triggering the Von Restorff Effect' : 'One of 20 identical elements. Your brain filters these out.'}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">
                {clicked === specialIndex ? 'You clicked the odd one out!' : 'Interesting choice!'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {clicked === specialIndex
                  ? 'Your brain naturally gravitated to the unique element. This is the Isolation Effect in action.'
                  : 'Most people click the unique element first. The brain is wired to spot differences.'}
              </p>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> When multiple similar objects are present, the one that differs from the rest is most likely to be remembered. Use this for CTAs, important notifications, and pricing highlights.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setClicked(null); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="von-restorff" lawName="Von Restorff Effect" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
