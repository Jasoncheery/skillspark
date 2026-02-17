import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-cute">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 animate-fade-in-up">
          ✨ SkillSpark ✨
        </h1>
        <p className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in-up delay-100">
          Ignite Your Learning Journey
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in-up delay-200">
          Empowering educators and students with AI-powered tools 🚀
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
          <Link href="/ai-tools" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-cute shadow-cute hover-lift transition-all duration-300">
            🤖 Explore AI Tools
          </Link>
          <Link href="/lessons" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-4 px-8 rounded-cute shadow-cute hover-lift transition-all duration-300">
            📚 Join a Lesson
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 px-4">
        <div className="bg-card rounded-cute-lg shadow-cute p-8 text-center hover-lift animate-scale-in">
          <div className="animate-float">
            <Image src="/globe.svg" alt="AI Tools" width={80} height={80} className="mx-auto mb-4" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">🌟 AI Tools Showcase</h3>
          <p className="text-muted-foreground text-lg">Discover and compare the best AI tools for education.</p>
        </div>
        <div className="bg-card rounded-cute-lg shadow-cute p-8 text-center hover-lift animate-scale-in delay-100">
          <div className="animate-float" style={{ animationDelay: '0.5s' }}>
            <Image src="/file.svg" alt="Lessons" width={80} height={80} className="mx-auto mb-4" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">📖 Interactive Lessons</h3>
          <p className="text-muted-foreground text-lg">Engage with online courses and offline workshops.</p>
        </div>
        <div className="bg-card rounded-cute-lg shadow-cute p-8 text-center hover-lift animate-scale-in delay-200">
          <div className="animate-float" style={{ animationDelay: '1s' }}>
            <Image src="/window.svg" alt="AI Content" width={80} height={80} className="mx-auto mb-4" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">✨ AI-Powered Content</h3>
          <p className="text-muted-foreground text-lg">Generate SEO-optimized blogs and educational materials.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-4xl mx-auto text-center py-16 px-4">
        <div className="bg-gradient-peachy rounded-cute-lg shadow-cute-lg p-12 animate-scale-in delay-300">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
            Ready to Transform Your Learning? 🎓
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of educators and students already using SkillSpark
          </p>
          <Link href="/auth/register" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-10 rounded-cute shadow-cute hover-lift transition-all duration-300 text-lg">
            Get Started Free 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}
