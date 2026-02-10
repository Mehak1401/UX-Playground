import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Accessibility, Eye, EyeOff } from 'lucide-react';

type SimMode = 'none' | 'grayscale' | 'protanopia' | 'blur';

export default function AccessibilityLab() {
  const [mode, setMode] = useState<SimMode>('none');
  const { addXP } = useGame();
  const [triedModes, setTriedModes] = useState<Set<SimMode>>(new Set());

  const setSimulation = (m: SimMode) => {
    setMode(m);
    if (!triedModes.has(m) && m !== 'none') {
      setTriedModes(prev => new Set(prev).add(m));
      addXP(15);
    }
  };

  const filterStyle: React.CSSProperties =
    mode === 'grayscale' ? { filter: 'grayscale(1)' }
    : mode === 'protanopia' ? { filter: 'saturate(0.3) hue-rotate(-20deg)' }
    : mode === 'blur' ? { filter: 'blur(2px)' }
    : {};

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Accessibility className="h-6 w-6 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">Accessibility Simulator</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Experience the web through <strong className="text-foreground">different visual abilities</strong>. Toggle simulations to see why accessibility matters.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="glass rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium mb-4 text-foreground">Toggle Simulation:</p>
          <div className="flex flex-wrap gap-3">
            {([
              { id: 'none' as SimMode, label: '👁️ Normal Vision', desc: 'No simulation' },
              { id: 'grayscale' as SimMode, label: '⬛ Grayscale', desc: 'Achromatopsia' },
              { id: 'protanopia' as SimMode, label: '🔴 Protanopia', desc: 'Red-green blindness' },
              { id: 'blur' as SimMode, label: '🔍 Low Vision', desc: 'Blurred (20/200)' },
            ]).map(sim => (
              <button
                key={sim.id}
                onClick={() => setSimulation(sim.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  mode === sim.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {sim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Content */}
        <div style={filterStyle} className="transition-all duration-500 space-y-8">
          {/* Color-dependent buttons */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
            <h3 className="text-lg font-bold">Color-Only Feedback</h3>
            <p className="text-sm text-muted-foreground">Can you tell which is the error and which is success?</p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium">
                Error: Payment Failed
              </div>
              <div className="px-6 py-3 rounded-xl bg-success text-success-foreground font-medium">
                Success: Order Placed
              </div>
              <div className="px-6 py-3 rounded-xl bg-warning text-warning-foreground font-medium">
                Warning: Low Stock
              </div>
            </div>
            {mode === 'grayscale' || mode === 'protanopia' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-primary/10">
                <p className="text-sm"><strong className="text-primary">💡 Problem:</strong> Without color, these buttons look nearly identical. Always pair color with icons, text, or patterns.</p>
              </motion.div>
            ) : null}
          </div>

          {/* Low contrast text */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
            <h3 className="text-lg font-bold">Contrast Matters</h3>
            <div className="space-y-2">
              <p style={{ color: 'hsl(var(--muted-foreground) / 0.3)' }} className="text-sm">This text has very low contrast (0.3 opacity). Can you read it?</p>
              <p style={{ color: 'hsl(var(--muted-foreground) / 0.5)' }} className="text-sm">This text is slightly better (0.5 opacity). Still hard?</p>
              <p className="text-sm text-foreground">This text meets WCAG AA standards. Much easier!</p>
            </div>
            {mode === 'blur' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-primary/10">
                <p className="text-sm"><strong className="text-primary">💡 Problem:</strong> With impaired vision, low-contrast text becomes completely invisible. WCAG requires a 4.5:1 contrast ratio for normal text.</p>
              </motion.div>
            )}
          </div>

          {/* Icon-only navigation */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
            <h3 className="text-lg font-bold">Icon-Only vs Labeled</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3">Without labels:</p>
                <div className="flex gap-3">
                  <button className="p-3 rounded-xl bg-secondary"><Eye className="h-5 w-5 text-muted-foreground" /></button>
                  <button className="p-3 rounded-xl bg-secondary"><EyeOff className="h-5 w-5 text-muted-foreground" /></button>
                  <button className="p-3 rounded-xl bg-secondary"><Accessibility className="h-5 w-5 text-muted-foreground" /></button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-3">With labels:</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-secondary text-sm inline-flex items-center gap-2"><Eye className="h-4 w-4" /> Show</button>
                  <button className="px-4 py-2 rounded-xl bg-secondary text-sm inline-flex items-center gap-2"><EyeOff className="h-4 w-4" /> Hide</button>
                  <button className="px-4 py-2 rounded-xl bg-secondary text-sm inline-flex items-center gap-2"><Accessibility className="h-4 w-4" /> a11y</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {triedModes.size >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl bg-primary/10 text-center">
            <p className="font-bold text-lg mb-1">🏆 Explorer Badge Unlocked!</p>
            <p className="text-sm text-muted-foreground">You tried all simulation modes. You now understand why accessibility is non-negotiable.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
