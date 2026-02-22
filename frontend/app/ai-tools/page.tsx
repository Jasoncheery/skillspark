'use client';

import Link from 'next/link';
import Image from 'next/image';

// Placeholder AI tools data - will be replaced with Strapi API calls
const aiTools = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI for answering questions and generating content',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    features: ['Natural conversation', 'Content generation', 'Code assistance'],
    url: 'https://chat.openai.com',
  },
  {
    id: 2,
    name: 'Claude',
    description: 'Anthropic\'s AI assistant focused on safety and helpfulness',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    features: ['Long context', 'Document analysis', 'Coding help'],
    url: 'https://claude.ai',
  },
  {
    id: 3,
    name: 'Midjourney',
    description: 'AI-powered image generation from text descriptions',
    category: 'Image Generation',
    pricing: 'From $10/month',
    features: ['High-quality images', 'Multiple styles', 'Upscaling'],
    url: 'https://midjourney.com',
  },
  {
    id: 4,
    name: 'Grammarly',
    description: 'AI writing assistant for grammar, spelling, and style',
    category: 'Writing Assistant',
    pricing: 'Free / $12/month',
    features: ['Grammar checking', 'Style suggestions', 'Plagiarism detection'],
    url: 'https://grammarly.com',
  },
  {
    id: 5,
    name: 'Canva AI',
    description: 'Design platform with AI-powered features',
    category: 'Design',
    pricing: 'Free / $12.99/month',
    features: ['AI image generation', 'Magic resize', 'Background remover'],
    url: 'https://canva.com',
  },
  {
    id: 6,
    name: 'Notion AI',
    description: 'AI-powered note-taking and productivity tool',
    category: 'Productivity',
    pricing: 'Free / $10/month',
    features: ['Content generation', 'Summarization', 'Translation'],
    url: 'https://notion.so',
  },
];

const categories = ['All', 'Conversational AI', 'Image Generation', 'Writing Assistant', 'Design', 'Productivity'];

export default function AIToolsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            AI Tools Showcase
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover and compare the best AI tools for education
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-white text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors shadow-sm"
            >
              {category}
            </button>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {tool.name}
                  </h3>
                  <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                    {tool.category}
                  </span>
                  </div>
                  <p className="text-muted-foreground mb-4 min-h-[3rem]">
                    {tool.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <svg className="w-4 h-4 mr-2 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-foreground">{tool.pricing}</span>
                  <Link
                    href={`/ai-tools/${tool.id}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center bg-card rounded-xl shadow-md p-8 border-2 border-border">
          <p className="text-muted-foreground">
            More AI tools coming soon! This page will be dynamically populated from our CMS.
          </p>
        </div>
      </div>
    </div>
  );
}
