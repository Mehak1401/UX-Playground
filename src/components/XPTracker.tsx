import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

const levelIcons: Record<string, React.ReactNode> = {
  'Novice': <Star className="h-3.5 w-3.5" />,
  'Apprentice': <Zap className="h-3.5 w-3.5" />,
  'UX Architect': <Trophy className="h-3.5 w-3.5" />,
};

const levelThresholds = [
  { name: 'Novice', min: 0, max: 200 },
  { name: 'Apprentice', min: 200, max: 500 },
  { name: 'UX Architect', min: 500, max: 1000 },
];

export function XPTracker() {
  const { xp, level } = useGame();
  const currentLevel = levelThresholds.find(l => l.name === level) || levelThresholds[0];
  const progress = Math.min(((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 bg-secondary rounded-full pl-4 pr-2 py-1.5"
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{levelIcons[level]}</span>
        <span className="text-xs font-medium hidden sm:inline">{level}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-12 h-1.5 rounded-full bg-background overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">{xp}</span>
      </div>
    </motion.div>
  );
}
