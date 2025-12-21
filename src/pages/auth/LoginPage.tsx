import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import { Layout } from '../../components/layout/Layout';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { initialize } = useAuthStore();
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authService.signIn(data);

      if (response.success) {
        // Reinitialize auth store to get updated user and profile
        await initialize();

        showToast('登入成功！', 'success');

        // Redirect to intended page or dashboard based on role
        const from = (location.state as any)?.from?.pathname || '/';
        const { profile } = useAuthStore.getState();

        if (from !== '/' && from !== '/login') {
          navigate(from, { replace: true });
        } else {
          // Redirect based on user role
          if (profile?.role === 'admin') {
            navigate('/dashboard/admin', { replace: true });
          } else if (profile?.role === 'teacher') {
            navigate('/dashboard/teacher', { replace: true });
          } else if (profile?.role === 'student') {
            navigate('/dashboard/student', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      } else {
        showToast(response.error || '登入失敗，請檢查您的帳號密碼', 'error');
      }
    } catch (error: any) {
      showToast(error.message || '發生錯誤，請稍後再試', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    if (!email) {
      showToast('請先輸入您的電子郵件', 'warning');
      return;
    }

    const response = await authService.resetPassword(email);
    if (response.success) {
      showToast('密碼重設郵件已發送，請檢查您的信箱', 'success');
    } else {
      showToast(response.error || '發送失敗，請稍後再試', 'error');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="ml-2 text-3xl font-bold text-gray-900">SkillSpark</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入您的帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            還沒有帳號？{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              立即註冊
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  電子郵件
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('email', {
                      required: '請輸入電子郵件',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '請輸入有效的電子郵件地址',
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className="input-field pl-10"
                    placeholder="輸入您的電子郵件"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密碼
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: '請輸入密碼',
                      minLength: {
                        value: 6,
                        message: '密碼長度至少 6 個字元',
                      },
                    })}
                    type="password"
                    autoComplete="current-password"
                    className="input-field pl-10"
                    placeholder="輸入您的密碼"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    記住我
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    忘記密碼？
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      登入中...
                    </>
                  ) : (
                    '登入'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
