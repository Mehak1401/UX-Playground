import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from '@/components/QuizModal';
import { useGame } from '@/context/GameContext';
import { Palette, RotateCcw } from 'lucide-react';

const quizQuestions = [
  {
    scenario: 'You are reviewing two checkout flows. One is visually polished but has a broken coupon field. The other is plain but fully functional.',
    question: 'Why do users rate the polished version higher in usability tests?',
    options: [
      { label: 'A', text: 'Because it actually is more usable — beauty equals function' },
      { label: 'B', text: 'Because the Aesthetic-Usability Effect causes users to forgive usability issues in beautiful designs' },
      { label: 'C', text: 'Because users didn\'t test the coupon field' },
    ],
    correctAnswer: 'B',
    feedback: 'Exactly! The Aesthetic-Usability Effect means users perceive attractive designs as more usable, and are more tolerant of minor issues.',
  },
];

export default function AestheticUsability() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [choice, setChoice] = useState<'ugly' | 'pretty' | null>(null);
  const [prettyClicks, setPrettyClicks] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useGame();

  const handlePrettySubmit = () => {
    setPrettyClicks(c => c + 1);
    // Button is "broken" — does nothing visually except count
  };

  const handleUglySubmit = () => {
    setChoice('ugly');
    addXP(30);
    setTimeout(() => setPhase('done'), 600);
  };

  const handlePickPretty = () => {
    setChoice('pretty');
    addXP(20);
    setTimeout(() => setPhase('done'), 1200);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Aesthetic-Usability Effect</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Users often perceive <strong className="text-foreground">aesthetically pleasing</strong> design as design that's more usable.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Palette className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">The Beauty Bias</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You'll see two login forms. Pick the one you think is <strong className="text-foreground">better</strong>. Try submitting both.
              </p>
              <button onClick={() => setPhase('game')} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Game
              </button>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-center text-sm text-muted-foreground mb-8">Try both forms. Which one is "better"?</p>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Ugly but functional */}
                <div className="p-6 rounded-lg border-2 border-dashed border-muted-foreground/30" style={{ fontFamily: 'Times New Roman, serif', background: 'hsl(40 30% 92%)' }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#333' }}>Login Form A</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#555' }}>Email:</label>
                      <input type="text" placeholder="your@email.com" className="w-full p-2 border-2 border-muted-foreground/40 rounded-sm bg-background text-foreground" style={{ fontFamily: 'Times New Roman' }} />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ color: '#555' }}>Password:</label>
                      <input type="password" placeholder="••••••" className="w-full p-2 border-2 border-muted-foreground/40 rounded-sm bg-background text-foreground" style={{ fontFamily: 'Times New Roman' }} />
                    </div>
                    <button
                      onClick={handleUglySubmit}
                      className="w-full p-2 rounded-sm font-bold text-primary-foreground transition-colors"
                      style={{ background: '#666', fontFamily: 'Times New Roman' }}
                      data-insight="This ugly button works perfectly. Don't judge a form by its border-radius."
                    >
                      Submit
                    </button>
                  </div>
                  {choice === 'ugly' && <p className="mt-3 text-sm font-bold" style={{ color: 'green' }}>✅ Login successful!</p>}
                </div>

                {/* Pretty but broken */}
                <div className="p-6 rounded-2xl border border-border bg-card shadow-xl">
                  <h3 className="text-lg font-bold mb-4 text-foreground">Login Form B</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1.5 text-muted-foreground font-medium">Email</label>
                      <input type="text" placeholder="your@email.com" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5 text-muted-foreground font-medium">Password</label>
                      <input type="password" placeholder="••••••" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none" />
                    </div>
                    <button
                      onClick={handlePrettySubmit}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow"
                      data-insight="This beautiful button is actually broken. Beauty ≠ Usability."
                    >
                      Submit
                    </button>
                  </div>
                  {prettyClicks > 0 && (
                    <p className="mt-3 text-sm text-destructive">
                      {prettyClicks >= 3 ? '🤔 Still not working... Maybe try Form A?' : 'Nothing happened...'}
                    </p>
                  )}
                  {prettyClicks >= 3 && !choice && (
                    <button onClick={handlePickPretty} className="mt-2 text-xs text-muted-foreground underline">
                      Give up on this form
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">
                {choice === 'ugly' ? 'You chose function over form!' : 'You fell for the beauty bias!'}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {choice === 'pretty'
                  ? `You clicked the pretty button ${prettyClicks} time(s) before giving up. Most users forgive broken functionality if the design is attractive.`
                  : 'Most users try the pretty form first. Your instinct to test functionality is rare!'}
              </p>
              <div className="p-4 rounded-xl bg-primary/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-primary">💡 Insight:</strong> Beauty covers up usability issues. Users are more forgiving of minor problems in visually appealing interfaces. But beauty can never replace function.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setPhase('intro'); setChoice(null); setPrettyClicks(0); }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
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
      <QuizModal lawId="aesthetic-usability" lawName="Aesthetic-Usability Effect" questions={quizQuestions} isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
}
