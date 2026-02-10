import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Brain, RotateCcw } from 'lucide-react';

const randomDigits = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');

const quizQuestions = [
  {
    scenario: 'You are displaying a credit card number input field.',
    question: 'Which format is easiest for the user to read and verify?',
    options: [
      { label: 'A', text: '1234567812345678' },
      { label: 'B', text: '1234 5678 1234 5678' },
      { label: 'C', text: '1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8' },
    ],
    correctAnswer: 'B',
    feedback: 'Correct! "Chunking" the credit card number into groups of four aligns perfectly with Miller\'s Law.',
  },
];

export default function MillersLaw() {
  const [phase, setPhase] = useState<'intro' | 'unchunked' | 'recall-1' | 'chunked' | 'recall-2' | 'done'>('intro');
  const [digits] = useState(randomDigits);
  const [input, setInput] = useState('');
  const [showDigits, setShowDigits] = useState(true);
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useGame();

  useEffect(() => {
    if (phase === 'unchunked' || phase === 'chunked') {
      setShowDigits(true);
      setInput('');
      const t = setTimeout(() => setShowDigits(false), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (!showDigits && phase === 'unchunked') setPhase('recall-1');
    if (!showDigits && phase === 'chunked') setPhase('recall-2');
  }, [showDigits, phase]);

  const handleSubmit = () => {
    const cleaned = input.replace(/\s/g, '');
    if (phase === 'recall-1') {
      setResult1(cleaned);
      addXP(20);
      setPhase('chunked');
    } else if (phase === 'recall-2') {
      setResult2(cleaned);
      addXP(30);
      setPhase('done');
    }
  };

  const chunked = digits.replace(/(.{4})/g, '$1 ').trim();
  const score1 = [...digits].filter((d, i) => d === (result1[i] || '')).length;
  const score2 = [...digits].filter((d, i) => d === (result2[i] || '')).length;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Miller's Law</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            The average person can hold <strong className="text-foreground">7 ± 2</strong> items in working memory.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Memory Game</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You'll see 12 random digits for <strong className="text-foreground">3 seconds</strong>. Then type them back. First raw, then chunked.
              </p>
              <button onClick={() => setPhase('unchunked')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {(phase === 'unchunked' || phase === 'chunked') && showDigits && (
            <motion.div key={phase} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-12 text-center space-y-4">
              <p className="text-sm font-mono text-warning">Memorize these digits!</p>
              <p className={`text-4xl sm:text-5xl font-mono font-bold tracking-wider ${phase === 'unchunked' ? 'text-warning' : 'text-primary'}`}>
                {phase === 'unchunked' ? digits : chunked}
              </p>
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          )}

          {(phase === 'recall-1' || phase === 'recall-2') && (
            <motion.div key={`recall-${phase}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <p className="text-sm font-mono text-muted-foreground">
                {phase === 'recall-1' ? 'Level 1: Raw digits' : 'Level 2: Chunked digits'}
              </p>
              <h2 className="text-2xl font-bold">Type the digits from memory</h2>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full max-w-sm mx-auto block text-center text-2xl font-mono p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                placeholder="Type the digits..."
                maxLength={20}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">
                Submit
              </button>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">Chunking is Magic!</h2>
              <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <p className="font-mono text-2xl font-bold text-warning">{score1}/12</p>
                  <p className="text-xs text-muted-foreground mt-1">Raw digits</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="font-mono text-2xl font-bold text-primary">{score2}/12</p>
                  <p className="text-xs text-muted-foreground mt-1">Chunked digits</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> By breaking long strings into groups of 3-4, we make information digestible for the human brain.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setPhase('intro')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="millers" lawName="Miller's Law" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
