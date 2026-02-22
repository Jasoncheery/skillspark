'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Placeholder data - will be replaced with Strapi API calls
const toolsData: Record<string, any> = {
  '1': {
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI for answering questions and generating content',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    features: ['Natural conversation', 'Content generation', 'Code assistance', 'Multiple languages'],
    pros: ['Very natural responses', 'Wide range of capabilities', 'Regular updates'],
    cons: ['Can be inaccurate', 'Limited context window (free)', 'Requires internet'],
    useCases: ['Student Q&A', 'Lesson planning', 'Content creation', 'Homework help'],
    url: 'https://chat.openai.com',
  },
  '2': {
    name: 'Claude',
    description: 'Anthropic\'s AI assistant focused on safety and helpfulness',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    features: ['Long context', 'Document analysis', 'Coding help', 'Safe responses'],
    pros: ['Very long context window', 'Excellent at analysis', 'Safety-focused'],
    cons: ['Sometimes overly cautious', 'Limited free tier', 'Newer than competitors'],
    useCases: ['Document analysis', 'Research assistance', 'Code review', 'Essay writing'],
    url: 'https://claude.ai',
  },
};

export default function AIToolDetailPage() {
  const params = useParams();
  const toolId = params.id as string;
  const tool = toolsData[toolId];

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error-600 mb-4">AI Tool not found</p>
          <Link href="/ai-tools" className="text-primary-600 hover:text-primary-700">
            ← Back to AI Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/ai-tools" className="text-primary hover:text-primary/80 mb-6 inline-block">
          ← Back to AI Tools
        </Link>

        <div className="bg-card rounded-xl shadow-lg p-8 mb-8 border-2 border-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                {tool.name}
              </h1>
              <span className="px-3 py-1 text-sm font-medium bg-primary/20 text-primary rounded-full">
                {tool.category}
              </span>
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Visit Website →
            </a>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            {tool.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
              <ul className="space-y-2">
                {tool.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Pricing</h2>
              <p className="text-lg text-primary font-semibold mb-6">{tool.pricing}</p>

              <h2 className="text-2xl font-bold text-foreground mb-4">Use Cases</h2>
              <ul className="space-y-2">
                {tool.useCases.map((useCase: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-accent mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h2 className="text-xl font-bold text-green-900 mb-4">Pros</h2>
              <ul className="space-y-2">
                {tool.pros.map((pro: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">+</span>
                    <span className="text-green-800">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <h2 className="text-xl font-bold text-red-900 mb-4">Cons</h2>
              <ul className="space-y-2">
                {tool.cons.map((con: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-2">-</span>
                    <span className="text-red-800">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl p-6 text-center border-2 border-primary/20">
          <p className="text-foreground mb-4">
            Want to try this tool in your classroom?
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
