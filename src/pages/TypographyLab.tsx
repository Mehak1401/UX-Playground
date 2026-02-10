import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Type, Check, Zap, Eye, BookOpen, Heading, AlignLeft, Trophy, RefreshCw, Lightbulb, Target, Sparkles } from 'lucide-react';

const TARGET = { lineHeight: 1.5, letterSpacing: 0, fontWeight: 400 };
const TOLERANCE = { lineHeight: 0.15, letterSpacing: 0.5, fontWeight: 100 };

const CHALLENGES = [
  {
    id: 'readability',
    name: 'The Readability Test',
    description: 'Fix this unreadable text to make it comfortable for long-form reading.',
    initial: { lineHeight: 1.0, letterSpacing: 3, fontWeight: 200 },
    target: TARGET,
    tolerance: TOLERANCE,
    content: 'Good typography is invisible. When text is well-set, readers absorb the content without noticing the presentation. The goal is effortless reading.',
    hint: 'Aim for relaxed line height, normal letter spacing, and regular weight.',
  },
  {
    id: 'headline',
    name: 'Headline Hero',
    description: 'Create impact with a bold headline while keeping it readable.',
    initial: { lineHeight: 1.8, letterSpacing: -1, fontWeight: 100 },
    target: { lineHeight: 1.1, letterSpacing: 0.5, fontWeight: 700 },
    tolerance: { lineHeight: 0.1, letterSpacing: 0.3, fontWeight: 100 },
    content: 'Typography Is The Voice Of Design',
    isHeading: true,
    hint: 'Headlines need tight line height, slightly wider letter spacing, and bold weight.',
  },
  {
    id: 'elegant',
    name: 'Elegant Caption',
    description: 'Style small text with sophistication and clarity.',
    initial: { lineHeight: 2.0, letterSpacing: 4, fontWeight: 900 },
    target: { lineHeight: 1.4, letterSpacing: 0.25, fontWeight: 400 },
    tolerance: { lineHeight: 0.2, letterSpacing: 0.3, fontWeight: 100 },
    content: 'Photography by Henri Cartier-Bresson • Paris, 1954',
    isCaption: true,
    hint: 'Captions work best with tight line height, subtle letter spacing, and light-to-normal weight.',
  },
];

function isGood(val: number, target: number, tol: number) {
  return Math.abs(val - target) <= tol;
}

function calculateScore(values: typeof TARGET, target: typeof TARGET, tolerance: typeof TOLERANCE) {
  const lhScore = 1 - Math.min(Math.abs(values.lineHeight - target.lineHeight) / (tolerance.lineHeight * 2), 1);
  const lsScore = 1 - Math.min(Math.abs(values.letterSpacing - target.letterSpacing) / (tolerance.letterSpacing * 2), 1);
  const fwScore = 1 - Math.min(Math.abs(values.fontWeight - target.fontWeight) / (tolerance.fontWeight * 2), 1);
  return Math.round(((lhScore + lsScore + fwScore) / 3) * 100);
}

function getReadabilityLabel(score: number) {
  if (score >= 95) return { label: 'Perfect!', color: 'text-emerald-400', bg: 'bg-emerald-500/20', emoji: '✨' };
  if (score >= 80) return { label: 'Great', color: 'text-green-400', bg: 'bg-green-500/20', emoji: '😊' };
  if (score >= 60) return { label: 'Getting There', color: 'text-yellow-400', bg: 'bg-yellow-500/20', emoji: '😐' };
  if (score >= 40) return { label: 'Needs Work', color: 'text-orange-400', bg: 'bg-orange-500/20', emoji: '😬' };
  return { label: 'Illegible', color: 'text-red-400', bg: 'bg-red-500/20', emoji: '😵' };
}

export default function TypographyLab() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const challenge = CHALLENGES[challengeIndex];

  const [lineHeight, setLineHeight] = useState(challenge.initial.lineHeight);
  const [letterSpacing, setLetterSpacing] = useState(challenge.initial.letterSpacing);
  const [fontWeight, setFontWeight] = useState(challenge.initial.fontWeight);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [celebration, setCelebration] = useState(false);
  const { addXP } = useGame();

  // Reset when challenge changes
  useEffect(() => {
    setLineHeight(challenge.initial.lineHeight);
    setLetterSpacing(challenge.initial.letterSpacing);
    setFontWeight(challenge.initial.fontWeight);
    setSolved(false);
    setShowHint(false);
    setCompareMode(false);
    setCelebration(false);
  }, [challengeIndex, challenge]);

  const lhGood = isGood(lineHeight, challenge.target.lineHeight, challenge.tolerance.lineHeight);
  const lsGood = isGood(letterSpacing, challenge.target.letterSpacing, challenge.tolerance.letterSpacing);
  const fwGood = isGood(fontWeight, challenge.target.fontWeight, challenge.tolerance.fontWeight);
  const allGood = lhGood && lsGood && fwGood;

  const score = calculateScore(
    { lineHeight, letterSpacing, fontWeight },
    challenge.target,
    challenge.tolerance
  );
  const readability = getReadabilityLabel(score);

  const handleCheck = useCallback(() => {
    if (allGood && !solved) {
      setSolved(true);
      setCelebration(true);
      addXP(50);
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges(prev => [...prev, challenge.id]);
      }
      setTimeout(() => setCelebration(false), 2000);
    }
  }, [allGood, solved, challenge.id, completedChallenges, addXP]);

  const handleReset = () => {
    setLineHeight(challenge.initial.lineHeight);
    setLetterSpacing(challenge.initial.letterSpacing);
    setFontWeight(challenge.initial.fontWeight);
    setSolved(false);
  };

  const nextChallenge = () => {
    setChallengeIndex((prev) => (prev + 1) % CHALLENGES.length);
  };

  const prevChallenge = () => {
    setChallengeIndex((prev) => (prev - 1 + CHALLENGES.length) % CHALLENGES.length);
  };

  const getFeedback = () => {
    if (allGood) return { text: 'Perfect! This typography is on point.', color: 'text-emerald-400', icon: Sparkles };
    const issues = [];
    if (!lhGood) {
      const diff = lineHeight - challenge.target.lineHeight;
      if (Math.abs(diff) > challenge.tolerance.lineHeight) {
        issues.push(diff < 0 ? 'Lines feel cramped — give them more room to breathe!' : 'Too much space between lines — tighten it up!');
      }
    }
    if (!lsGood) {
      const diff = letterSpacing - challenge.target.letterSpacing;
      if (Math.abs(diff) > challenge.tolerance.letterSpacing) {
        issues.push(diff < 0 ? 'Letters are too tight — they need space!' : 'Letters are drifting apart — bring them closer!');
      }
    }
    if (!fwGood) {
      const diff = fontWeight - challenge.target.fontWeight;
      if (Math.abs(diff) > challenge.tolerance.fontWeight) {
        issues.push(diff < 0 ? 'Too thin! Give it more weight.' : 'Too heavy! Lighten it up.');
      }
    }
    return { text: issues[0] || 'Keep adjusting...', color: 'text-yellow-400', icon: Lightbulb };
  };

  const feedback = getFeedback();
  const FeedbackIcon = feedback.icon;

  const displayValues = compareMode ? challenge.target : { lineHeight, letterSpacing, fontWeight };

  return (
    <div className="min-h-screen py-12 px-6">
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0
                }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  scale: [0, 1.5, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut"
                }}
                className="absolute text-4xl"
              >
                {['✨', '🎉', '🎯', '💫', '⭐'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Type className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Typography Lab</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Master the art of typesetting through hands-on challenges. Fix broken typography and make text shine!
          </p>
        </motion.div>

        {/* Challenge Navigator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/50 border border-border">
            <button
              onClick={prevChallenge}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Previous challenge"
            >
              ←
            </button>

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">Challenge {challengeIndex + 1} of {CHALLENGES.length}</span>
                {completedChallenges.includes(challenge.id) && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <h2 className="font-bold text-lg">{challenge.name}</h2>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>

            <button
              onClick={nextChallenge}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Next challenge"
            >
              →
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Readability Score */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Readability Score
                </h3>
                <span className={`text-2xl font-bold ${readability.color}`}>
                  {readability.emoji} {score}%
                </span>
              </div>

              {/* Score Bar */}
              <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${
                    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
              <p className={`text-sm font-medium ${readability.color}`}>{readability.label}</p>
            </div>

            {/* Controls */}
            <div className="glass rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <AlignLeft className="h-5 w-5 text-primary" />
                  Controls
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      compareMode
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    👁 Compare
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Line Height Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Line Height
                  </span>
                  <motion.span
                    className={`font-mono text-sm px-2 py-1 rounded ${lhGood ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary'}`}
                    animate={lhGood ? { scale: [1, 1.1, 1] } : {}}
                  >
                    {lineHeight.toFixed(2)}x {lhGood && '✓'}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={2.5}
                  step={0.05}
                  value={lineHeight}
                  onChange={e => setLineHeight(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${lhGood ? '#10b981' : '#888'} 0%, ${lhGood ? '#10b981' : '#888'} ${((lineHeight - 0.8) / (2.5 - 0.8)) * 100}%, #27272a ${((lineHeight - 0.8) / (2.5 - 0.8)) * 100}%, #27272a 100%)` }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cramped</span>
                  <span>Spacious</span>
                </div>
              </div>

              {/* Letter Spacing Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="font-serif text-lg">T</span>
                    Letter Spacing
                  </span>
                  <motion.span
                    className={`font-mono text-sm px-2 py-1 rounded ${lsGood ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary'}`}
                    animate={lsGood ? { scale: [1, 1.1, 1] } : {}}
                  >
                    {letterSpacing.toFixed(1)}px {lsGood && '✓'}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={8}
                  step={0.1}
                  value={letterSpacing}
                  onChange={e => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #27272a 0%, #27272a ${((letterSpacing + 2) / 10) * 100}%, ${lsGood ? '#10b981' : '#888'} ${((letterSpacing + 2) / 10) * 100}%, ${lsGood ? '#10b981' : '#888'} 100%)` }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tight</span>
                  <span>Wide</span>
                </div>
              </div>

              {/* Font Weight Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    Font Weight
                  </span>
                  <motion.span
                    className={`font-mono text-sm px-2 py-1 rounded ${fwGood ? 'bg-emerald-500/20 text-emerald-400' : 'bg-secondary'}`}
                    animate={fwGood ? { scale: [1, 1.1, 1] } : {}}
                  >
                    {fontWeight} {fwGood && '✓'}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={900}
                  step={100}
                  value={fontWeight}
                  onChange={e => setFontWeight(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #27272a 0%, #27272a ${((fontWeight - 100) / 800) * 100}%, ${fwGood ? '#10b981' : '#888'} ${((fontWeight - 100) / 800) * 100}%, ${fwGood ? '#10b981' : '#888'} 100%)` }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hairline</span>
                  <span>Heavy</span>
                </div>
              </div>

              {/* Hint Toggle */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full py-2 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-600 dark:text-yellow-400"
                  >
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {challenge.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feedback */}
              <motion.div
                key={feedback.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl bg-secondary flex items-start gap-3 text-sm font-medium ${feedback.color}`}
              >
                <FeedbackIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                {feedback.text}
              </motion.div>

              {/* Submit Button */}
              <AnimatePresence mode="wait">
                {allGood && !solved && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheck}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
                  >
                    ✨ Submit Perfect Typography
                  </motion.button>
                )}
              </AnimatePresence>

              {solved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center"
                >
                  <p className="font-bold text-emerald-400 text-lg">🏆 +50 XP — Typography Master!</p>
                  <button
                    onClick={nextChallenge}
                    className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Next Challenge →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Live Preview
                </h3>
                {compareMode && (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                    Showing: Target
                  </span>
                )}
              </div>

              <div className={`p-8 min-h-[300px] flex items-center justify-center transition-all duration-300 ${
                challenge.isHeading ? 'bg-gradient-to-br from-purple-500/5 to-pink-500/5' :
                challenge.isCaption ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5' :
                'bg-gradient-to-br from-blue-500/5 to-cyan-500/5'
              }`}>
                <motion.div
                  className={`text-foreground transition-all duration-200 ${
                    challenge.isHeading ? 'text-4xl md:text-5xl font-bold text-center' :
                    challenge.isCaption ? 'text-sm text-center text-muted-foreground' :
                    'text-base'
                  }`}
                  animate={{
                    lineHeight: displayValues.lineHeight,
                    letterSpacing: `${displayValues.letterSpacing}px`,
                    fontWeight: displayValues.fontWeight,
                  }}
                >
                  {challenge.content}
                </motion.div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border transition-colors ${lhGood ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card border-border'}`}>
                <p className="text-xs text-muted-foreground mb-1">Line Height</p>
                <p className={`font-mono font-bold ${lhGood ? 'text-emerald-400' : 'text-foreground'}`}>
                  {lineHeight.toFixed(2)}x
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {challenge.target.lineHeight}x
                </p>
              </div>

              <div className={`p-4 rounded-xl border transition-colors ${lsGood ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card border-border'}`}>
                <p className="text-xs text-muted-foreground mb-1">Tracking</p>
                <p className={`font-mono font-bold ${lsGood ? 'text-emerald-400' : 'text-foreground'}`}>
                  {letterSpacing.toFixed(1)}px
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {challenge.target.letterSpacing}px
                </p>
              </div>

              <div className={`p-4 rounded-xl border transition-colors ${fwGood ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card border-border'}`}>
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className={`font-mono font-bold ${fwGood ? 'text-emerald-400' : 'text-foreground'}`}>
                  {fontWeight}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {challenge.target.fontWeight}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-medium mb-3">Your Progress</p>
              <div className="flex items-center gap-2">
                {CHALLENGES.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setChallengeIndex(i)}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      i === challengeIndex
                        ? 'bg-primary h-3'
                        : completedChallenges.includes(c.id)
                        ? 'bg-emerald-500'
                        : 'bg-secondary'
                    }`}
                    aria-label={`Go to challenge ${i + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedChallenges.length} of {CHALLENGES.length} completed
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
