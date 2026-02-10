import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, List, Brain, Eye, Loader, Palette, Zap, LayoutGrid, Scale, Star, ShieldAlert, Accessibility, Type, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const coreLaws = [
  { name: "Fitts's Law", desc: "Size and distance affect usability", icon: Target, path: '/fitts', color: 'from-blue-500/20 to-cyan-500/20' },
  { name: "Hick's Law", desc: "Less choices mean faster decisions", icon: List, path: '/hicks', color: 'from-violet-500/20 to-purple-500/20' },
  { name: "Miller's Law", desc: "Chunk information into 7±2 groups", icon: Brain, path: '/millers', color: 'from-emerald-500/20 to-teal-500/20' },
  { name: "Von Restorff", desc: "Different things stand out more", icon: Eye, path: '/von-restorff', color: 'from-amber-500/20 to-orange-500/20' },
  { name: "Zeigarnik Effect", desc: "Incomplete tasks stick in memory", icon: Loader, path: '/zeigarnik', color: 'from-rose-500/20 to-pink-500/20' },
];

const advancedLaws = [
  { name: "Aesthetic-Usability", desc: "Beauty improves perceived usability", icon: Palette, path: '/aesthetic-usability', color: 'from-fuchsia-500/20 to-pink-500/20' },
  { name: "Doherty Threshold", desc: "Stay under 400ms to maintain flow", icon: Zap, path: '/doherty', color: 'from-yellow-500/20 to-amber-500/20' },
  { name: "Law of Proximity", desc: "Nearness creates visual grouping", icon: LayoutGrid, path: '/proximity', color: 'from-indigo-500/20 to-blue-500/20' },
  { name: "Tesler's Law", desc: "Complexity can only be shifted", icon: Scale, path: '/teslers', color: 'from-slate-500/20 to-gray-500/20' },
  { name: "Peak-End Rule", desc: "Endings shape our memories", icon: Star, path: '/peak-end', color: 'from-orange-500/20 to-red-500/20' },
];

const playgrounds = [
  { name: "Dark Pattern Dojo", desc: "Learn to spot deceptive patterns", icon: ShieldAlert, path: '/dark-patterns', color: 'from-red-500/20 to-rose-500/20' },
  { name: "Accessibility Lab", desc: "Simulate visual impairments", icon: Accessibility, path: '/accessibility', color: 'from-green-500/20 to-emerald-500/20' },
  { name: "Typography Lab", desc: "Master text hierarchy", icon: Type, path: '/typography', color: 'from-sky-500/20 to-blue-500/20' },
];

export default function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background Gradient */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive UX Playground
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            Master UX through
            <br />
            <span className="text-muted-foreground">playful interaction</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Learn fundamental UX laws through hands-on experiments.
            Break the rules, feel the friction, and understand why great design works.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/fitts" className="gap-2">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full">
              <Link to="#laws">
                Explore Laws
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Core Laws Section */}
      <section id="laws" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">The Fundamentals</span>
              <h2 className="text-3xl font-semibold tracking-tight">Core Heuristics</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Five essential principles that form the foundation of user experience design.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreLaws.map((law, i) => (
              <motion.div
                key={law.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={law.path}
                  className="group block p-6 rounded-3xl bg-card border border-border hover:border-foreground/20 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${law.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                    <law.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{law.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{law.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Laws Section */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Go Deeper</span>
              <h2 className="text-3xl font-semibold tracking-tight">Psychology & Perception</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Advanced principles that shape user behavior and decision-making.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedLaws.map((law, i) => (
              <motion.div
                key={law.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={law.path}
                  className="group block p-6 rounded-3xl bg-background border border-border hover:border-foreground/20 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${law.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                    <law.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{law.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{law.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Playgrounds Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Hands-on Learning</span>
              <h2 className="text-3xl font-semibold tracking-tight">Interactive Labs</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Specialized environments to test and explore specific UX concepts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playgrounds.map((law, i) => (
              <motion.div
                key={law.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={law.path}
                  className="group block p-6 rounded-3xl bg-card border border-border hover:border-foreground/20 transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${law.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                    <law.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{law.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{law.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Ready to start learning?
            </h2>
            <p className="text-background/70 text-lg mb-8 max-w-xl mx-auto">
              Begin with Fitts's Law and progress through all 13 interactive lessons.
              Track your progress and earn XP as you master each concept.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
              <Link to="/fitts" className="gap-2">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" className="text-background"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background"/>
                </svg>
              </div>
              <span className="font-semibold">UXLaws</span>
            </div>
            <p className="text-sm text-muted-foreground">
              An interactive case study in UX education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
