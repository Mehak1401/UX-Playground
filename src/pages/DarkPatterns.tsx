import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { ShieldAlert, RotateCcw, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DarkPatterns() {
  const [phase, setPhase] = useState<'intro' | 'game' | 'done'>('intro');
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const { addXP } = useGame();

  useEffect(() => {
    if (phase === 'game' && !found) {
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(id);
    }
  }, [phase, found]);

  const handleWrongClick = (label: string) => {
    setAttempts(a => a + 1);
  };

  const handleFound = () => {
    setFound(true);
    addXP(60);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setPhase('done'), 1500);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <h1 className="text-3xl sm:text-4xl font-bold">Dark Pattern Dojo</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Learn to <strong className="text-foreground">spot deceptive UI</strong> so you never build it. Can you find the hidden cancel button?
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                <ShieldAlert className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Cancel the Subscription</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You're being charged $19.99/month. Find and click the <strong className="text-foreground">real Cancel button</strong>. It won't be easy — that's the point.
              </p>
              <button onClick={() => { setPhase('game'); setTimer(0); setAttempts(0); setFound(false); }} className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 glow">
                Start Challenge
              </button>
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {timer}s</span>
                <span>Misclicks: {attempts}</span>
              </div>

              {/* The deceptive cancellation page */}
              <div className="bg-card rounded-2xl border border-border p-8 max-w-lg mx-auto space-y-6">
                <h3 className="text-xl font-bold text-center">We're sorry to see you go 😢</h3>
                <p className="text-muted-foreground text-center text-sm">
                  Are you sure? You'll lose access to all premium features, your saved data, and exclusive discounts.
                </p>

                {/* Misleading options */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleWrongClick('keep')}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 glow"
                    data-insight="Dark Pattern: The brightest, largest button is NOT the cancel — it's designed to keep you subscribed."
                  >
                    ✨ Keep My Premium Benefits
                  </button>

                  <button
                    onClick={() => handleWrongClick('discount')}
                    className="w-full py-3 rounded-xl bg-success text-success-foreground font-semibold"
                    data-insight="Dark Pattern: Offering a discount is a retention tactic that distracts from the cancel action."
                  >
                    🎁 Get 50% Off Instead
                  </button>

                  <button
                    onClick={() => handleWrongClick('pause')}
                    className="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-secondary"
                    data-insight="Dark Pattern: 'Pause' sounds like cancel but isn't. You'd still be subscribed."
                  >
                    ⏸️ Pause Subscription (Still Charged)
                  </button>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    By continuing your subscription you agree to our terms. To manage preferences visit settings. For questions contact support. Changes apply at next billing cycle.
                    <button
                      onClick={handleFound}
                      className="text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer mx-1"
                      style={{ fontSize: '10px' }}
                      data-insight="Found it! This tiny, low-contrast text IS the cancel button. This is a classic dark pattern."
                    >
                      cancel membership
                    </button>
                    All rights reserved.
                  </p>
                </div>

                {attempts >= 2 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-warning text-center">
                    💡 Hint: Read the fine print very carefully...
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">You found it! 🎉</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="font-mono text-2xl font-bold">{timer}s</p>
                  <p className="text-sm text-muted-foreground">Time taken</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary">
                  <p className="font-mono text-2xl font-bold">{attempts}</p>
                  <p className="text-sm text-muted-foreground">Misclicks</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-destructive/10 max-w-lg mx-auto">
                <p className="text-sm"><strong className="text-destructive">⚠️ Dark Patterns Used:</strong> Oversized "Keep" button, emotional guilt trip, discount distraction, and the cancel link hidden as tiny gray text in legalese. Never do this to your users.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setPhase('intro')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-medium">
                  <RotateCcw className="h-4 w-4" /> Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
