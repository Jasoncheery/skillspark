'use client';

import Link from 'next/link';
import Image from 'next/image';

// Placeholder blog data - will be replaced with Strapi API calls
const blogPosts = [
  {
    id: 1,
    title: '10 Ways AI is Transforming Education in 2026',
    excerpt: 'Discover how artificial intelligence is revolutionizing the classroom experience for both teachers and students.',
    author: 'Sarah Chen',
    date: '2026-02-15',
    category: 'AI in Education',
    readTime: '5 min read',
    image: '/globe.svg',
  },
  {
    id: 2,
    title: 'Getting Started with ChatGPT in Your Classroom',
    excerpt: 'A practical guide for teachers looking to integrate ChatGPT into their lesson plans effectively.',
    author: 'Michael Rodriguez',
    date: '2026-02-10',
    category: 'Teaching Tips',
    readTime: '7 min read',
    image: '/window.svg',
  },
  {
    id: 3,
    title: 'The Future of Personalized Learning',
    excerpt: 'How AI-powered adaptive learning platforms are creating customized educational experiences.',
    author: 'Emily Watson',
    date: '2026-02-05',
    category: 'EdTech Trends',
    readTime: '6 min read',
    image: '/file.svg',
  },
  {
    id: 4,
    title: 'Ethical Considerations for AI in Education',
    excerpt: 'Exploring the important ethical questions surrounding the use of AI tools in educational settings.',
    author: 'Dr. James Liu',
    date: '2026-01-30',
    category: 'AI Ethics',
    readTime: '8 min read',
    image: '/globe.svg',
  },
  {
    id: 5,
    title: 'Best AI Tools for Creating Educational Content',
    excerpt: 'A comprehensive review of the top AI tools that help teachers create engaging educational materials.',
    author: 'Sarah Chen',
    date: '2026-01-25',
    category: 'Tool Reviews',
    readTime: '10 min read',
    image: '/window.svg',
  },
  {
    id: 6,
    title: 'Student Success Stories with AI Learning',
    excerpt: 'Real-world examples of students who have improved their learning outcomes using AI-powered tools.',
    author: 'Michael Rodriguez',
    date: '2026-01-20',
    category: 'Success Stories',
    readTime: '5 min read',
    image: '/file.svg',
  },
];

const categories = ['All', 'AI in Education', 'Teaching Tips', 'EdTech Trends', 'AI Ethics', 'Tool Reviews', 'Success Stories'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">
            SkillSpark Blog
          </h1>
          <p className="text-xl text-neutral-600">
            Insights, tips, and stories about AI in education
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

        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <Link
            href={`/blog/${blogPosts[0].id}`}
            className="block bg-white rounded-xl shadow-lg overflow-hidden mb-12 group hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center p-12">
                <Image src={blogPosts[0].image} alt={blogPosts[0].title} width={200} height={200} />
              </div>
              <div className="md:w-1/2 p-8">
                <span className="px-3 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full">
                  Featured
                </span>
                <h2 className="text-3xl font-bold text-neutral-900 mt-4 mb-4 group-hover:text-primary-600 transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-neutral-600 mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center text-sm text-neutral-500 space-x-4">
                  <span>{blogPosts[0].author}</span>
                  <span>•</span>
                  <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center p-8">
                <Image src={post.image} alt={post.title} width={100} height={100} />
              </div>
              <div className="p-6">
                <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-neutral-900 mt-3 mb-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-neutral-500 space-x-2">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="mt-4 text-sm text-neutral-500">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6">Subscribe to our newsletter for the latest insights on AI in education</p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-neutral-100 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
