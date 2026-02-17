import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              SkillSpark
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Empowering educators with AI tools and educational resources.
              Discover practical AI solutions, join workshops, and access
              comprehensive learning materials.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/ai-tools"
                className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Explore AI Tools
              </Link>
              <Link
                href="/lessons"
                className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                View Lessons
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              What We Offer
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-xl font-semibold">AI Tools Directory</h3>
                <p className="text-muted-foreground">
                  Comprehensive directory of practical AI tools with detailed
                  information, tutorials, and use cases.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-xl font-semibold">Educational Resources</h3>
                <p className="text-muted-foreground">
                  Online courses and offline workshops to help you master AI
                  tools and enhance your teaching.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-3 text-xl font-semibold">AI-Powered Content</h3>
                <p className="text-muted-foreground">
                  Generate educational content, worksheets, and exam papers using
                  advanced AI technology.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
