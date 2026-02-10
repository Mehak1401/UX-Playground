import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Loader, RotateCcw } from 'lucide-react';

const steps = [
  { label: 'Display Name', placeholder: 'John Doe' },
  { label: 'Bio', placeholder: 'Tell us about yourself...' },
  { label: 'Profile Photo', placeholder: 'Choose a photo' },
  { label: 'Location', placeholder: 'San Francisco, CA' },
  { label: 'Website', placeholder: 'https://...' },
];

const quizQuestions = [
  {
    scenario: 'You want users to complete their profile setup.',
    question: 'How do you motivate them using the Zeigarnik Effect?',
    options: [
      { label: 'A', text: 'Send them an email saying "Please complete your profile."' },
      { label: 'B', text: 'Show a dashboard widget saying "Profile Strength: 15% — Add a photo to level up!"' },
      { label: 'C', text: 'Hide the profile section until they are ready.' },
    ],
    correctAnswer: 'B',
    feedback: 'Showing them they have already started (but haven\'t finished) triggers the psychological urge to complete the pattern.',
  },
];

export default function ZeigarnikEffect() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [completed, setCompleted] = useState<boolean[]>(new Array(steps.length).fill(false));
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useGame();

  const progress = Math.round((completed.filter(Boolean).length / steps.length) * 100);

  const toggleStep = (i: number) => {
    const next = [...completed];
    next[i] = !next[i];
    setCompleted(next);

    if (!completed[i]) addXP(10);

    if (next.every(Boolean)) {
      setTimeout(() => setPhase('done'), 600);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Loader className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Zeigarnik Effect</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            People remember <strong className="text-foreground">uncompleted tasks</strong> better than completed ones.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Loader className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Completion Urge</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We'll start your profile at <strong className="text-foreground">0%</strong>. Watch how the incomplete progress bar compels you to finish it.
              </p>
              <button onClick={() => setPhase('game')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Progress Bar */}
              <div className="glass rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Profile Strength</span>
                  <span className={`font-mono font-bold ${progress === 100 ? 'text-success' : progress > 50 ? 'text-primary' : 'text-warning'}`}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${progress === 100 ? 'bg-success' : 'bg-primary'}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                {progress < 100 && (
                  <p className="text-sm text-muted-foreground">
                    {progress === 0 ? 'Start filling out your profile!' : progress < 60 ? 'Almost halfway there...' : "So close! Don't stop now!"}
                  </p>
                )}
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    layout
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      completed[i]
                        ? 'bg-success/10 border-success/30'
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                    onClick={() => toggleStep(i)}
                    data-insight={completed[i] ? 'Completed! But the incomplete items above still nag at you.' : 'This uncompleted field creates mental tension — the Zeigarnik Effect'}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          completed[i] ? 'bg-success border-success' : 'border-muted-foreground/30'
                        }`}>
                          {completed[i] && <span className="text-success-foreground text-xs">✓</span>}
                        </div>
                        <span className={`font-medium ${completed[i] ? 'line-through text-muted-foreground' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{completed[i] ? 'Done' : 'Click to complete'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">You couldn't resist, could you?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                That nagging feeling of incompletion drove you to fill every field. That's the Zeigarnik Effect.
              </p>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> Incomplete tasks create mental tension that drives users to finish. Use progress bars, checklists, and "almost done" messaging to motivate completion.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setCompleted(new Array(steps.length).fill(false)); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="zeigarnik" lawName="Zeigarnik Effect" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
