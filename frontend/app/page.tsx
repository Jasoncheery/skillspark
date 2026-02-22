"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, BookOpen, Calculator, FlaskConical, Trophy, Lightbulb
} from "lucide-react";
import { OwlAvatar } from "@/components/ui/OwlAvatar";

const features = [
  { 
    icon: Calculator, 
    title: "🌟 AI Tools Showcase", 
    description: "Discover and compare the best AI tools for education",
    color: "from-primary to-accent",
    delay: 0
  },
  { 
    icon: BookOpen, 
    title: "📖 Interactive Lessons", 
    description: "Engage with online courses and offline workshops",
    color: "from-green-400 to-emerald-400",
    delay: 0.1
  },
  { 
    icon: FlaskConical, 
    title: "✨ AI-Powered Content", 
    description: "Generate SEO-optimized blogs and educational materials",
    color: "from-purple-400 to-pink-400",
    delay: 0.2
  },
];

export default function Home() {
  return (
    <div className="relative">

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <motion.div 
          className="inline-block mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <OwlAvatar size={120} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground mb-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-base font-bold">
              🦉 Oliver the Owl 🦉
            </span>
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ✨ SkillSpark ✨
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-2xl md:text-3xl font-bold text-primary mb-2 animate-fade-in-up delay-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Ignite Your Learning Journey
        </motion.p>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up delay-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Empowering educators and students with AI-powered tools 🚀
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/ai-tools" 
              className="inline-block bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold py-4 px-8 rounded-cute shadow-cute hover-lift transition-all duration-300"
            >
              🤖 Explore AI Tools
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/lessons" 
              className="inline-block bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-4 px-8 rounded-cute shadow-cute hover-lift transition-all duration-300"
            >
              📚 Join a Lesson
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + feature.delay, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="bg-card rounded-cute-lg shadow-cute-lg p-8 text-center border-2 border-primary/20 hover:border-primary/40 transition-all"
          >
            <motion.div 
              className="animate-float mb-4"
              style={{ animationDelay: `${idx * 0.5}s` }}
            >
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-primary mb-3">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-lg">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-4xl mx-auto text-center py-16 px-4">
        <motion.div 
          className="bg-gradient-peachy rounded-cute-lg shadow-cute-lg p-12 border-2 border-primary/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Ready to Transform Your Learning? 🎓
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of educators and students already using SkillSpark
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/auth/register" 
              className="inline-block bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold py-4 px-10 rounded-cute shadow-cute hover-lift transition-all duration-300 text-lg"
            >
              Get Started Free 🚀
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Fun fact section */}
      <section className="w-full max-w-2xl mx-auto text-center py-12 px-4">
        <motion.div
          className="bg-card/80 backdrop-blur-md rounded-cute-lg shadow-cute p-6 border-2 border-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lightbulb className="w-6 h-6 text-accent" />
            <span className="text-lg font-bold text-primary">Fun Fact!</span>
        </div>
          <p className="text-muted-foreground">
            Learning is more fun with a friend! 🦉✨
          </p>
        </motion.div>
      </section>
    </div>
  );
}
