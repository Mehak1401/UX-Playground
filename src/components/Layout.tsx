import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XPTracker } from './XPTracker';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const allLaws = [
  { name: "Fitts's Law", path: '/fitts' },
  { name: "Hick's Law", path: '/hicks' },
  { name: "Miller's Law", path: '/millers' },
  { name: "Von Restorff Effect", path: '/von-restorff' },
  { name: "Zeigarnik Effect", path: '/zeigarnik' },
  { name: "Aesthetic-Usability", path: '/aesthetic-usability' },
  { name: "Doherty Threshold", path: '/doherty' },
  { name: "Law of Proximity", path: '/proximity' },
  { name: "Tesler's Law", path: '/teslers' },
  { name: "Peak-End Rule", path: '/peak-end' },
  { name: "Dark Pattern Dojo", path: '/dark-patterns' },
  { name: "Accessibility Lab", path: '/accessibility' },
  { name: "Typography Lab", path: '/typography' },
];

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPage = allLaws.find(law => law.path === location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center transition-transform group-hover:scale-105">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-background"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background"/>
                </svg>
              </div>
              <span className="font-semibold text-base tracking-tight">UXLaws</span>
            </Link>

            {/* Desktop Navigation - Simplified */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isHome
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Home
              </Link>
              <div className="h-4 w-px bg-border mx-1" />
              <div className="relative group">
                <button className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Laws
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 opacity-60" />
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-popover border border-border rounded-2xl shadow-xl p-2 min-w-[200px]">
                    {allLaws.map((law) => (
                      <Link
                        key={law.path}
                        to={law.path}
                        className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                          location.pathname === law.path
                            ? 'bg-secondary text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                      >
                        {law.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <XPTracker />
              <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-10 w-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isHome ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <div className="pt-4 pb-2">
                <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  UX Laws
                </span>
              </div>
              {allLaws.map((law) => (
                <Link
                  key={law.path}
                  to={law.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm transition-colors ${
                    location.pathname === law.path
                      ? 'bg-secondary text-foreground font-medium'
                      : 'text-muted-foreground'
                  }`}
                >
                  {law.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
