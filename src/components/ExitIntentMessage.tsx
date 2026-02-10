import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  "You were a poem I wrote too softly, bye.",
  "Please don't go, we were just beginning...",
  "Every exit is an entrance somewhere else, but stay?",
  "The page feels empty without you...",
  "Wait - one more design secret before you leave?",
  "Leaving so soon? The journey's just starting...",
  "Your curiosity is a light, don't dim it yet...",
];

export function ExitIntentMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const showMessage = useCallback(() => {
    // Pick random message
    const randomIndex = Math.floor(Math.random() * MESSAGES.length);
    setMessageIndex(randomIndex);
    setIsVisible(true);
  }, []);

  const hideMessage = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Exit intent detection - mouse leaving viewport
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves through any edge (top, left, right)
      const isLeavingTop = e.clientY < 10;
      const isLeavingLeft = e.clientX < 10;
      const isLeavingRight = e.clientX > window.innerWidth - 10;

      if (isLeavingTop || isLeavingLeft || isLeavingRight) {
        showMessage();
      }
    };

    // Hide when mouse re-enters the document
    const handleMouseEnter = () => {
      hideMessage();
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [showMessage, hideMessage]);

  const currentMessage = MESSAGES[messageIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              delay: 0.1,
            }}
            className="px-8 py-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/90 text-lg md:text-xl font-light text-center tracking-wide"
            >
              {currentMessage}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
