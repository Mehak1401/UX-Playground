import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Check, X } from 'lucide-react';

interface QuizQuestion {
  scenario: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  feedback: string;
}

interface QuizModalProps {
  lawId: string;
  lawName: string;
  questions: QuizQuestion[];
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ lawId, lawName, questions, isOpen, onClose }: QuizModalProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { addXP, recordQuiz, completeLaw } = useGame();

  const q = questions[currentQ];

  const handleSelect = (answer: string) => {
    if (showFeedback) return;
    setSelected(answer);
    setShowFeedback(true);

    const correct = answer === q.correctAnswer;
    if (correct) {
      setScore(s => s + 1);
      addXP(100);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      const passed = score >= Math.ceil(questions.length / 2);
      recordQuiz(lawId, passed);
      if (passed) completeLaw(lawId);
      setFinished(true);
    }
  };

  const handleClose = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border border-border rounded-2xl max-w-lg w-full p-8 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {finished ? (
            <div className="text-center space-y-6">
              <div className="text-6xl">{score >= Math.ceil(questions.length / 2) ? '🏆' : '📚'}</div>
              <h3 className="text-2xl font-bold">{score >= Math.ceil(questions.length / 2) ? 'Mastery Achieved!' : 'Keep Learning!'}</h3>
              <p className="text-muted-foreground">
                You scored {score}/{questions.length} on {lawName}
              </p>
              <p className="font-mono text-primary text-lg">+{score * 100} XP</p>
              <button onClick={handleClose} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">
                  Question {currentQ + 1}/{questions.length}
                </span>
                <span className="text-sm font-mono text-primary">{score * 100} XP</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Scenario</p>
                <p className="text-sm text-muted-foreground">{q.scenario}</p>
              </div>

              <h3 className="text-lg font-semibold">{q.question}</h3>

              <div className="space-y-3">
                {q.options.map(opt => {
                  const isCorrect = opt.label === q.correctAnswer;
                  const isSelected = opt.label === selected;
                  let borderClass = 'border-border hover:border-primary/50';
                  if (showFeedback && isSelected) {
                    borderClass = isCorrect ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10 animate-shake';
                  } else if (showFeedback && isCorrect) {
                    borderClass = 'border-success/50';
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${borderClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-sm font-bold text-muted-foreground mt-0.5">{opt.label}</span>
                        <span className="text-sm">{opt.text}</span>
                        {showFeedback && isSelected && (
                          isCorrect ? <Check className="ml-auto h-5 w-5 text-success shrink-0" /> : <X className="ml-auto h-5 w-5 text-destructive shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-secondary text-sm"
                >
                  <p className="font-semibold mb-1">{selected === q.correctAnswer ? '✅ Correct!' : '❌ Not quite.'}</p>
                  <p className="text-muted-foreground">{q.feedback}</p>
                </motion.div>
              )}

              {showFeedback && (
                <button onClick={handleNext} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
