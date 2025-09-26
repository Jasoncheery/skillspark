import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react'

export const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h1>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Learning Streak</p>
                <p className="text-2xl font-bold text-indigo-600">7 days</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                  <p className="text-2xl font-semibold text-gray-900">8</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Certificates</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Hours Learned</p>
                  <p className="text-2xl font-semibold text-gray-900">124</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                  <p className="text-2xl font-semibold text-gray-900">92%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Continue Learning */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Continue Learning</h2>
                <div className="space-y-4">
                  {[
                    { 
                      name: 'React Advanced Patterns', 
                      progress: 67, 
                      nextLesson: 'Higher-Order Components',
                      timeLeft: '2h 15m'
                    },
                    { 
                      name: 'Machine Learning Fundamentals', 
                      progress: 34, 
                      nextLesson: 'Linear Regression',
                      timeLeft: '4h 30m'
                    },
                    { 
                      name: 'Python for Data Science', 
                      progress: 89, 
                      nextLesson: 'Final Project',
                      timeLeft: '1h 45m'
                    },
                  ].map((course, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{course.name}</h3>
                        <span className="text-sm text-gray-500">{course.timeLeft} left</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Next: {course.nextLesson}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Skill Profile */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Skill Profile</h2>
                <div className="space-y-3">
                  {[
                    { skill: 'React Development', level: 85, color: 'bg-blue-500' },
                    { skill: 'Python Programming', level: 78, color: 'bg-green-500' },
                    { skill: 'Machine Learning', level: 45, color: 'bg-purple-500' },
                    { skill: 'Data Visualization', level: 62, color: 'bg-yellow-500' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.skill}</span>
                        <span className="text-gray-500">{item.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 btn-secondary text-sm">
                  View Full Profile
                </button>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-900">Next Course</h4>
                    <p className="text-sm text-indigo-700">Advanced TypeScript</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Skill Gap</h4>
                    <p className="text-sm text-green-700">DevOps Fundamentals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
