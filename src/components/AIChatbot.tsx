import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'model'; content: string };

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const pageContextMap: Record<string, string> = {
  '/': 'Homepage',
  '/fitts': "Fitts's Law",
  '/hicks': "Hick's Law",
  '/millers': "Miller's Law",
  '/von-restorff': 'Von Restorff Effect',
  '/zeigarnik': 'Zeigarnik Effect',
  '/aesthetic-usability': 'Aesthetic-Usability Effect',
  '/doherty': 'Doherty Threshold',
  '/proximity': 'Law of Proximity',
  '/teslers': "Tesler's Law",
  '/peak-end': 'Peak-End Rule',
  '/dark-patterns': 'Dark Pattern Dojo',
  '/accessibility': 'Accessibility Simulator',
  '/typography': 'Typography Lab',
};

const systemInstruction = `You are a helpful UX/UI design assistant. You help users understand UX laws, principles, and best practices. Provide clear, practical explanations with real-world examples. Keep responses concise and actionable. When relevant, suggest how to apply the principle in actual design work.`;

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const currentPage = pageContextMap[location.pathname] || null;

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Context-aware greeting when opening on a law page
  useEffect(() => {
    if (open && messages.length === 0 && currentPage && currentPage !== 'Homepage') {
      setMessages([
        {
          role: 'model',
          content: `I see you're exploring **${currentPage}**! 👋 Want to know how to apply this principle in real-world design? Ask me anything!`,
        },
      ]);
    }
  }, [open, currentPage]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for Gemini
      const contents = [];

      // Add conversation history (alternate user/model)
      for (const msg of updatedMessages) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      const resp = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error('Gemini API error:', resp.status, errText);
        setMessages(prev => [...prev, { role: 'model', content: `⚠️ API error (${resp.status}): ${errText.slice(0, 200)}` }]);
        setIsLoading(false);
        return;
      }

      const data = await resp.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: '⚠️ No response from AI.' }]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMessages(prev => [...prev, { role: 'model', content: '⚠️ Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, currentPage]);

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center animate-pulse-glow"
            aria-label="Open UX Assistant"
          >
            <Sparkles className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[400px] h-[500px] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{
              background: 'hsl(var(--glass-bg))',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">UX Assistant</h3>
                  <p className="text-xs text-muted-foreground">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center pt-8">
                  Ask me anything about UX laws! ✨
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'model' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask about a UX law..."
                  className="flex-1 rounded-xl bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                />
                <button
                  onClick={send}
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
