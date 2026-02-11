import { motion } from 'framer-motion';
import { Mail, Linkedin, Globe, Briefcase, Palette, ArrowUpRight, Sparkles } from 'lucide-react';

const contactLinks = [
  {
    name: 'Email',
    value: 'mehakrustagi1410@gmail.com',
    href: 'mailto:mehakrustagi1410@gmail.com',
    icon: Mail,
    color: 'from-rose-500 to-orange-500',
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/mehak-rustagi',
    href: 'https://www.linkedin.com/in/mehak-rustagi/',
    icon: Linkedin,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Website',
    value: 'mehakrustagi.in',
    href: 'https://mehakrustagi.in',
    icon: Globe,
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'Portfolio',
    value: 'Framer Portfolio',
    href: 'https://harmonious-polygon-710536.framer.app/#top',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Behance',
    value: 'behance.net/mehakrustagi2',
    href: 'https://www.behance.net/mehakrustagi2',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Let's Connect
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            Get In Touch
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            If you want to collaborate and grow together, let's connect.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${link.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                    {link.name}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground break-all">
                    {link.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Looking forward to creating something amazing together.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
