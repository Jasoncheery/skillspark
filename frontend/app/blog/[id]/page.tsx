'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Placeholder data - will be replaced with Strapi API calls
const blogPostsData: Record<string, any> = {
  '1': {
    title: '10 Ways AI is Transforming Education in 2026',
    excerpt: 'Discover how artificial intelligence is revolutionizing the classroom experience for both teachers and students.',
    author: 'Sarah Chen',
    date: '2026-02-15',
    category: 'AI in Education',
    readTime: '5 min read',
    image: '/globe.svg',
    content: `
      <p>Artificial Intelligence is no longer a futuristic concept—it's here, and it's transforming education in remarkable ways. As we navigate through 2026, let's explore the top 10 ways AI is reshaping how we teach and learn.</p>

      <h2>1. Personalized Learning Paths</h2>
      <p>AI algorithms analyze student performance and learning styles to create customized educational journeys. Each student receives content tailored to their pace and preferences.</p>

      <h2>2. Intelligent Tutoring Systems</h2>
      <p>24/7 AI tutors provide instant feedback and support, helping students overcome challenges at any time of day.</p>

      <h2>3. Automated Grading and Feedback</h2>
      <p>Teachers save hours with AI-powered grading systems that provide detailed, constructive feedback on assignments.</p>

      <h2>4. Content Generation</h2>
      <p>AI tools help educators create engaging lesson plans, worksheets, and educational materials in minutes.</p>

      <h2>5. Language Learning</h2>
      <p>Advanced AI language models enable natural conversation practice and instant translation for multilingual classrooms.</p>

      <h2>6. Accessibility Enhancements</h2>
      <p>AI-powered tools make education more accessible through text-to-speech, speech-to-text, and adaptive interfaces.</p>

      <h2>7. Predictive Analytics</h2>
      <p>Early warning systems identify students at risk of falling behind, enabling timely interventions.</p>

      <h2>8. Virtual Labs and Simulations</h2>
      <p>AI creates realistic simulations for science experiments and practical training in safe, virtual environments.</p>

      <h2>9. Administrative Efficiency</h2>
      <p>From scheduling to resource allocation, AI streamlines administrative tasks, freeing up time for teaching.</p>

      <h2>10. Continuous Assessment</h2>
      <p>AI enables ongoing evaluation of student progress, moving beyond traditional testing to comprehensive understanding.</p>

      <h2>Conclusion</h2>
      <p>The integration of AI in education is not about replacing teachers—it's about empowering them with tools to provide better, more personalized education for every student. As we continue through 2026, these technologies will only become more sophisticated and accessible.</p>
    `,
  },
  '2': {
    title: 'Getting Started with ChatGPT in Your Classroom',
    excerpt: 'A practical guide for teachers looking to integrate ChatGPT into their lesson plans effectively.',
    author: 'Michael Rodriguez',
    date: '2026-02-10',
    category: 'Teaching Tips',
    readTime: '7 min read',
    image: '/window.svg',
    content: `
      <p>ChatGPT has become one of the most popular AI tools in education. This guide will help you integrate it effectively into your teaching practice.</p>

      <h2>Understanding ChatGPT</h2>
      <p>ChatGPT is a conversational AI that can assist with a wide range of educational tasks, from answering questions to generating creative content.</p>

      <h2>Practical Applications</h2>
      <ul>
        <li>Lesson plan generation and refinement</li>
        <li>Creating differentiated materials for diverse learners</li>
        <li>Generating discussion questions and prompts</li>
        <li>Providing examples and explanations</li>
      </ul>

      <h2>Best Practices</h2>
      <p>Always review AI-generated content for accuracy and appropriateness. Use ChatGPT as a starting point, not a final product.</p>

      <h2>Student Use Guidelines</h2>
      <p>Establish clear policies about when and how students can use ChatGPT. Focus on using it as a learning aid, not a shortcut.</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const post = blogPostsData[postId];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error-600 mb-4">Blog post not found</p>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-primary-600 hover:text-primary-700 mb-6 inline-block">
          ← Back to Blog
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Image */}
          <div className="bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center p-16">
            <Image src={post.image} alt={post.title} width={200} height={200} />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-neutral-600 mb-8 space-x-4">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-lg max-w-none">
              <div
                className="text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.75',
                }}
              />
            </div>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">About the Author</h3>
              <p className="text-neutral-600">
                <strong>{post.author}</strong> is an education technology specialist with over 10 years of experience
                helping teachers integrate AI tools into their classrooms.
              </p>
            </div>

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                  LinkedIn
                </button>
                <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/2"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <h3 className="text-lg font-bold text-neutral-900 mb-2 hover:text-primary-600">
                Getting Started with ChatGPT in Your Classroom
              </h3>
              <p className="text-neutral-600 text-sm">7 min read</p>
            </Link>
            <Link
              href="/blog/3"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <h3 className="text-lg font-bold text-neutral-900 mb-2 hover:text-primary-600">
                The Future of Personalized Learning
              </h3>
              <p className="text-neutral-600 text-sm">6 min read</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
