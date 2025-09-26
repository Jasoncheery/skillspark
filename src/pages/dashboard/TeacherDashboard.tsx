import { BookOpen, Users, BarChart3, Plus, Video, Bot } from 'lucide-react'

export const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Students</p>
                  <p className="text-2xl font-semibold text-gray-900">324</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Completion</p>
                  <p className="text-2xl font-semibold text-gray-900">87%</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Watch Time</p>
                  <p className="text-2xl font-semibold text-gray-900">1,250h</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tools Hub */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">AI Tools Hub</h2>
              <Bot className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">AI Avatar Studio</div>
                <div className="text-sm text-gray-500 mt-1">Create personalized AI avatars for your courses</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">Video Generator</div>
                <div className="text-sm text-gray-500 mt-1">Generate educational videos with AI</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">Content Analyzer</div>
                <div className="text-sm text-gray-500 mt-1">AI-powered content insights and optimization</div>
              </button>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Courses</h2>
            <div className="space-y-4">
              {[
                { name: 'Introduction to React', students: 45, progress: 78 },
                { name: 'Advanced JavaScript', students: 32, progress: 65 },
                { name: 'Node.js Fundamentals', students: 28, progress: 89 },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.progress}% avg completion</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
