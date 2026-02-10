import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { LayoutGrid, RotateCcw } from 'lucide-react';

const quizQuestions = [
  {
    scenario: 'A settings page has checkboxes with labels equally spaced between them.',
    question: 'How do you fix the ambiguous grouping using the Law of Proximity?',
    options: [
      { label: 'A', text: 'Add colored backgrounds to each group' },
      { label: 'B', text: 'Move each label closer to its corresponding checkbox, increasing space between groups' },
      { label: 'C', text: 'Add borders around everything' },
    ],
    correctAnswer: 'B',
    feedback: 'Exactly! Proximity is the strongest Gestalt cue. Moving labels closer to their controls creates clear visual relationships without extra decoration.',
  },
];

const fields = [
  { label: 'Full Name', placeholder: 'John Doe' },
  { label: 'Email Address', placeholder: 'john@example.com' },
  { label: 'Phone Number', placeholder: '+1 555 0123' },
  { label: 'Street Address', placeholder: '123 Main St' },
];

export default function LawOfProximity() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [spacing, setSpacing] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useGame();

  const isFixed = spacing > 70;

  const handleFix = () => {
    if (isFixed) {
      addXP(40);
      setPhase('done');
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Law of Proximity</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Objects that are <strong className="text-foreground">near each other</strong> tend to be grouped together. Space is a design tool.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <LayoutGrid className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Form Fixer</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                A messy form has equally spaced labels. Use the slider to <strong className="text-foreground">fix the spacing</strong> so labels clearly belong to their fields.
              </p>
              <button onClick={() => setPhase('game')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {/* Slider */}
              <div className="glass rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Fix Spacing</label>
                  <span className={`text-sm font-mono ${isFixed ? 'text-success' : 'text-warning'}`}>
                    {isFixed ? '✅ Grouped!' : '⚠️ Ambiguous'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spacing}
                  onChange={e => setSpacing(Number(e.target.value))}
                  className="w-full accent-primary"
                  data-insight={`Spacing: ${spacing}%. Labels need to be closer to their fields than to neighboring fields.`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Equal spacing (bad)</span>
                  <span>Grouped (good)</span>
                </div>
              </div>

              {/* The Form Preview */}
              <div className="bg-card rounded-2xl border border-border p-8 max-w-md mx-auto">
                <h3 className="text-lg font-bold mb-6 text-foreground">Contact Form</h3>
                <div className="space-y-0">
                  {fields.map((field, i) => {
                    const labelGap = 4 + spacing * 0.08;
                    const fieldGap = 24 - spacing * 0.16;
                    return (
                      <div key={i} style={{ marginBottom: i < fields.length - 1 ? `${fieldGap}px` : 0 }}>
                        <label
                          className="block text-sm font-medium text-muted-foreground"
                          style={{ marginBottom: `${labelGap}px` }}
                        >
                          {field.label}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                          readOnly
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {isFixed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button onClick={handleFix} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 glow">
                    ✅ Submit Fixed Form
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">Space creates relationships!</h2>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> By moving labels 8px closer to their fields, we created a clear relationship. The Gestalt Law of Proximity is the simplest and most powerful grouping tool. Space is not empty — it communicates.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setSpacing(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="proximity" lawName="Law of Proximity" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
