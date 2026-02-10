import { useState, useEffect, useCallback, useRef } from 'react';

interface CursorInsight {
  text: string;
  x: number;
  y: number;
}

export function InsightCursor() {
  const [insight, setInsight] = useState<CursorInsight | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const insightText = target.closest('[data-insight]')?.getAttribute('data-insight');

    if (insightText) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setInsight({ text: insightText, x: e.clientX, y: e.clientY });
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setInsight(null), 100);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleMouseMove]);

  if (!insight) return null;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: insight.x + 16,
        top: insight.y + 16,
        maxWidth: 280,
      }}
    >
      <div className="glass-strong rounded-lg px-3 py-2 text-xs font-mono text-foreground shadow-lg animate-slide-up">
        <span className="text-primary">💡</span> {insight.text}
      </div>
    </div>
  );
}
