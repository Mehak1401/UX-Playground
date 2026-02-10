import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Scale, RotateCcw } from 'lucide-react';

const quizQuestions = [
  {
    scenario: 'A product manager says "Let\'s simplify the checkout to just one button — no date picker, no address."',
    question: 'What does Tesler\'s Law tell you about this approach?',
    options: [
      { label: 'A', text: 'Great idea! Simpler is always better.' },
      { label: 'B', text: 'Every system has irreducible complexity — removing necessary inputs just moves the problem to the user or the system.' },
      { label: 'C', text: 'Add more buttons to be safe.' },
    ],
    correctAnswer: 'B',
    feedback: 'Correct! Tesler\'s Law says complexity can be moved but not eliminated. The key is putting it where it\'s most manageable — usually in the system.',
  },
];

type Token = { id: string; label: string; icon: string };
const tokens: Token[] = [
  { id: 'destination', label: 'Destination', icon: '✈️' },
  { id: 'date', label: 'Date', icon: '📅' },
  { id: 'seat', label: 'Seat Class', icon: '💺' },
];

export default function TeslersLaw() {
  const [phase, setPhase] = useState<'intro' | 'too-simple' | 'too-complex' | 'goldilocks' | 'done'>('intro');
  const [placed, setPlaced] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState('');
  const { addXP } = useGame();

  const handleBookSimple = () => {
    setError('❌ Error: Missing destination, date, and seat class!');
    setTimeout(() => setPhase('too-complex'), 2000);
  };

  const addToken = (id: string) => {
    if (!placed.includes(id)) {
      setPlaced(prev => [...prev, id]);
    }
  };

  const handleBookGoldilocks = () => {
    if (placed.length === tokens.length) {
      addXP(50);
      setPhase('done');
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Tesler's Law</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Every system has <strong className="text-foreground">irreducible complexity</strong> that cannot be removed — only moved.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Complexity Balance</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You'll try to book a flight with <strong className="text-foreground">too little</strong>, <strong className="text-foreground">too much</strong>, and <strong className="text-foreground">just right</strong> complexity.
              </p>
              <button onClick={() => setPhase('too-simple')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'too-simple' && (
            <motion.div key="simple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">Step 1: Too Simple</span>
              </div>
              <div className="glass rounded-2xl p-12 text-center space-y-6 max-w-md mx-auto">
                <h3 className="text-xl font-bold">Book a Flight</h3>
                <button
                  onClick={handleBookSimple}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90"
                  data-insight="One button can't capture destination, date, and seat. Complexity was hidden, not removed."
                >
                  ✈️ Book Now
                </button>
                {error && <p className="text-destructive text-sm animate-shake">{error}</p>}
              </div>
            </motion.div>
          )}

          {phase === 'too-complex' && (
            <motion.div key="complex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">Step 2: Too Complex</span>
              </div>
              <div className="glass rounded-2xl p-8 max-w-lg mx-auto">
                <h3 className="text-lg font-bold mb-4">Book a Flight (Developer View)</h3>
                <pre className="p-4 rounded-xl bg-secondary text-xs font-mono-code text-muted-foreground overflow-x-auto whitespace-pre">
{`SELECT f.flight_id, f.departure,
  f.arrival, s.seat_class
FROM flights f
JOIN seats s ON f.id = s.flight_id
WHERE f.date = $1
  AND f.destination = $2
  AND s.available = true
ORDER BY f.price ASC;`}
                </pre>
                <p className="text-sm text-muted-foreground mt-4 text-center">😵 Too much complexity exposed to the user!</p>
                <button
                  onClick={() => { setPhase('goldilocks'); setPlaced([]); }}
                  className="w-full mt-4 py-3 rounded-xl bg-warning text-warning-foreground font-semibold"
                >
                  Try the Balanced Version →
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'goldilocks' && (
            <motion.div key="goldilocks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">Step 3: Just Right</span>
              </div>

              {/* Token bank */}
              <div className="glass rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-4 text-center">Drag complexity tokens onto the booking form:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {tokens.filter(t => !placed.includes(t.id)).map(token => (
                    <button
                      key={token.id}
                      onClick={() => addToken(token.id)}
                      className="px-4 py-2 rounded-xl bg-secondary border border-border hover:border-primary/50 text-sm font-medium transition-all hover:scale-105"
                    >
                      {token.icon} {token.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking form */}
              <div className="bg-card rounded-2xl border border-border p-8 max-w-md mx-auto space-y-4">
                <h3 className="text-lg font-bold">Book a Flight</h3>
                {tokens.map(token => (
                  <div key={token.id} className={`p-3 rounded-xl border-2 border-dashed transition-all ${
                    placed.includes(token.id) ? 'border-success/50 bg-success/5' : 'border-muted-foreground/20'
                  }`}>
                    {placed.includes(token.id) ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span>{token.icon}</span>
                        <span>{token.label}</span>
                        <span className="ml-auto text-success text-xs">✓ Added</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 text-center">Drop {token.label} here</p>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleBookGoldilocks}
                  disabled={placed.length < tokens.length}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-90 glow transition-all"
                >
                  ✈️ Book Flight
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">You found the Goldilocks zone!</h2>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> You can't remove complexity entirely — you can only move it. The "Book Now" button hid complexity (and broke). The SQL view exposed too much. The token form balanced complexity between user and system.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setPlaced([]); setError(''); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="teslers" lawName="Tesler's Law" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
