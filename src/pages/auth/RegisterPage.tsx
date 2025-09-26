import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Zap className="h-10 w-10 text-indigo-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">Skillspark</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-500">Registration form coming soon...</p>
            <Link
              to="/login"
              className="mt-4 inline-block btn-primary"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
