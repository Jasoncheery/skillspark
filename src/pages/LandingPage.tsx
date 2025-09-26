import { Link } from 'react-router-dom'
import { BookOpen, Brain, Users, Zap } from 'lucide-react'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">Skillspark</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Enhanced Learning
            <span className="text-indigo-600 block">For the Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Skillspark combines traditional learning management with cutting-edge AI tools. 
            Create engaging content with AI avatars, track student progress intelligently, 
            and build comprehensive skill profiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg"
            >
              Start Free Trial
            </Link>
            <button className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium text-lg">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Modern Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Brain className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Tools Hub</h3>
              <p className="text-gray-600">
                Create AI avatars, generate videos, and use speech-to-text tools all in one place.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-600">
                AI-powered progress tracking and personalized learning recommendations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Skill Profiling</h3>
              <p className="text-gray-600">
                LinkedIn-style skill profiles with technology and STEM focus.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
              <p className="text-gray-600">
                Multi-tenant architecture built for organizations of any size.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; 2024 Skillspark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
