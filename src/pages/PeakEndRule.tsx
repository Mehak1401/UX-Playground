import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Star, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const quizQuestions = [
  {
    scenario: 'Your app has a 3-step onboarding flow. Users report it feels "meh."',
    question: 'Using the Peak-End Rule, what\'s the most impactful change?',
    options: [
      { label: 'A', text: 'Rewrite all the onboarding copy to be more engaging' },
      { label: 'B', text: 'Add a delightful, celebratory animation at the final step (confetti, welcome message)' },
      { label: 'C', text: 'Remove the onboarding entirely' },
    ],
    correctAnswer: 'B',
    feedback: 'Nailed it! The Peak-End Rule says people judge experiences by the peak and the end. A great ending transforms the entire memory of the experience.',
  },
];

export default function PeakEndRule() {
  const [phase, setPhase] = useState<'intro' | 'upload' | 'rating' | 'done'>('intro');
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { addXP } = useGame();

  useEffect(() => {
    if (phase === 'upload') {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            // Celebration!
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.3 } }), 300);
            setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.7 } }), 500);
            addXP(40);
            setTimeout(() => setPhase('rating'), 2000);
            return 100;
          }
          // Intentionally slow in the middle, speeds up at end
          const speed = prev < 40 ? 2 : prev < 80 ? 0.8 : 4;
          return Math.min(100, prev + speed);
        });
      }, 80);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, addXP]);

  const submitRating = () => {
    setPhase('done');
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-6 w-6 text-warning" />
            <h1 className="text-3xl sm:text-4xl font-bold">Peak-End Rule</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            People judge experiences by the <strong className="text-foreground">peak moment</strong> and the <strong className="text-foreground">end</strong>, not the average.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
                <Star className="h-10 w-10 text-warning" />
              </div>
              <h2 className="text-2xl font-bold">The Memory Hack</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Watch a "boring" file upload. The progress bar will be painfully slow in the middle. But pay attention to the <strong className="text-foreground">ending</strong>...
              </p>
              <button onClick={() => setPhase('upload')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Upload
              </button>
            </motion.div>
          )}

          {phase === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="glass rounded-2xl p-12 max-w-lg mx-auto text-center space-y-6">
                <div className="text-6xl">{progress < 100 ? '📁' : '🎉'}</div>
                <h3 className="text-xl font-bold">
                  {progress < 100 ? 'Uploading...' : 'Upload Complete!'}
                </h3>
                <div className="space-y-2">
                  <div className="h-4 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: progress < 100
                          ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)))'
                          : 'linear-gradient(90deg, hsl(var(--success)), hsl(142 71% 60%))',
                      }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">{Math.round(progress)}%</p>
                </div>
                {progress >= 100 && (
                  <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-lg font-bold text-success">
                    🙌 High five! That was awesome!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'rating' && (
            <motion.div key="rating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold">How was the upload experience?</h2>
              <p className="text-muted-foreground">Rate honestly — the middle was pretty boring, right?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star className={`h-10 w-10 ${star <= rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button onClick={submitRating} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 glow">
                    Submit Rating
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">
                You rated it {rating}/5 {rating >= 4 ? '— higher than the middle deserved!' : ''}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {rating >= 4
                  ? 'The upload was deliberately boring in the middle, yet the confetti ending made you remember it fondly.'
                  : 'Interesting! Most users rate it 4-5 stars because the ending celebration overshadows the boring middle.'}
              </p>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> A great ending can save a mediocre experience. Always finish strong — the last impression is the lasting impression.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setRating(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="peak-end" lawName="Peak-End Rule" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
