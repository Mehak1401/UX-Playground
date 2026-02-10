import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { List, RotateCcw, Clock } from 'lucide-react';

const allMovies = [
  'The Matrix', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction',
  'Fight Club', 'Forrest Gump', 'The Godfather', 'Parasite', 'Whiplash',
  'Joker', 'Blade Runner', 'Mad Max', 'Alien', 'Titanic',
  'Avatar', 'Jaws', 'Rocky', 'Gladiator', 'Braveheart',
  'The Shawshank Redemption', 'Se7en', 'Memento', 'Arrival', 'Dunkirk',
  'Tenet', 'Oppenheimer', 'Barbie', 'Spider-Man', 'Iron Man',
  'Toy Story', 'Finding Nemo', 'Up', 'WALL-E', 'Ratatouille',
  'Coco', 'Soul', 'Frozen', 'Moana', 'Shrek',
  'The Lion King', 'Aladdin', 'Mulan', 'Pocahontas', 'Hercules',
  'Tarzan', 'Bambi', 'Dumbo', 'Fantasia', 'Pinocchio',
];

const categories: Record<string, string[]> = {
  'Action': ['The Matrix', 'Mad Max', 'Gladiator', 'Braveheart', 'Iron Man'],
  'Drama': ['The Shawshank Redemption', 'Forrest Gump', 'The Godfather', 'Parasite', 'Whiplash'],
  'Sci-Fi': ['Inception', 'Interstellar', 'Blade Runner', 'Arrival', 'Tenet'],
};

const quizQuestions = [
  {
    scenario: 'A user is onboarding onto your new app.',
    question: 'Which design pattern best respects Hick\'s Law?',
    options: [
      { label: 'A', text: 'Showing all 15 features of the app on one screen immediately.' },
      { label: 'B', text: 'A "Skip" button that leads to a blank profile.' },
      { label: 'C', text: 'A step-by-step wizard showing only one question per screen.' },
    ],
    correctAnswer: 'C',
    feedback: 'Spot on! Breaking onboarding into linear steps prevents the user from feeling overwhelmed.',
  },
];

export default function HicksLaw() {
  const [phase, setPhase] = useState<'intro' | 'chaos' | 'organized' | 'done'>('intro');
  const [chaosTime, setChaosTime] = useState(0);
  const [orgTime, setOrgTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [target] = useState('Inception');
  const [showQuiz, setShowQuiz] = useState(false);
  const intervalRef = useRef<number>();
  const { addXP } = useGame();

  useEffect(() => {
    if (phase === 'chaos' || phase === 'organized') {
      const start = Date.now();
      intervalRef.current = window.setInterval(() => setTimer(Date.now() - start), 50);
      return () => clearInterval(intervalRef.current);
    }
  }, [phase]);

  const handleSelect = (movie: string) => {
    if (movie !== target) return;
    clearInterval(intervalRef.current);
    
    if (phase === 'chaos') {
      setChaosTime(timer);
      addXP(20);
      setPhase('organized');
      setTimer(0);
    } else if (phase === 'organized') {
      setOrgTime(timer);
      addXP(30);
      setPhase('done');
    }
  };

  const shuffled = [...allMovies].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <List className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Hick's Law</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Decision time increases with the <strong className="text-foreground">number and complexity</strong> of choices.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
                <List className="h-10 w-10 text-warning" />
              </div>
              <h2 className="text-2xl font-bold">The Choice Overload Game</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Find "<strong className="text-foreground">{target}</strong>" as fast as you can. First in chaos, then in order.
              </p>
              <button onClick={() => setPhase('chaos')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'chaos' && (
            <motion.div key="chaos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warning font-mono font-bold">Level 1: Chaos Mode</p>
                  <p className="text-sm text-muted-foreground">Find "{target}" in this mess!</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Clock className="h-4 w-4 text-warning" />
                  {(timer / 1000).toFixed(1)}s
                </div>
              </div>
              <div className="rounded-2xl bg-card border border-warning/30 p-6 flex flex-wrap gap-2">
                {shuffled.map((movie, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(movie)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-secondary hover:bg-primary/10 transition-colors"
                    data-insight={`Option ${i + 1} of ${shuffled.length} — cognitive overload!`}
                  >
                    {movie}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'organized' && (
            <motion.div key="organized" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary font-mono font-bold">Level 2: Organized Mode</p>
                  <p className="text-sm text-muted-foreground">Find "{target}" — now with categories!</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  {(timer / 1000).toFixed(1)}s
                </div>
              </div>
              <div className="rounded-2xl bg-card border border-primary/30 p-6 space-y-6">
                {Object.entries(categories).map(([cat, movies]) => (
                  <div key={cat}>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {movies.map((movie, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelect(movie)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-secondary hover:bg-primary/10 transition-colors"
                        >
                          {movie}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">Paralysis by Analysis!</h2>
              <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <p className="font-mono text-2xl font-bold text-warning">{(chaosTime / 1000).toFixed(1)}s</p>
                  <p className="text-xs text-muted-foreground mt-1">50 choices (chaos)</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="font-mono text-2xl font-bold text-primary">{(orgTime / 1000).toFixed(1)}s</p>
                  <p className="text-xs text-muted-foreground mt-1">3 categories</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> By categorizing options, we reduced your cognitive load. Always break complex tasks into smaller steps.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setTimer(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="hicks" lawName="Hick's Law" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
