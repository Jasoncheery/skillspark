import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { useToastStore } from '../../stores/toastStore';
import { Layout } from '../../components/layout/Layout';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
}

export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { initialize } = useAuthStore();
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authService.signUp({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });

      if (response.success) {
        showToast(
          '註冊成功！請檢查您的電子郵件以驗證帳號。',
          'success',
          7000
        );

        // Wait a bit then initialize auth
        setTimeout(async () => {
          await initialize();
          navigate('/login', { replace: true });
        }, 1000);
      } else {
        showToast(response.error || '註冊失敗，請稍後再試', 'error');
      }
    } catch (error: any) {
      showToast(error.message || '發生錯誤，請稍後再試', 'error');
    } finally {
      setIsLoading(false);
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
            建立新帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已經有帳號了？{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              立即登入
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  姓名
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('full_name', {
                      required: '請輸入您的姓名',
                    })}
                    type="text"
                    autoComplete="name"
                    className="input-field pl-10"
                    placeholder="輸入您的姓名"
                  />
                  <User className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-error">{errors.full_name.message}</p>
                )}
              </div>

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
                    autoComplete="new-password"
                    className="input-field pl-10"
                    placeholder="輸入密碼（至少 6 個字元）"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  確認密碼
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: '請確認密碼',
                      validate: (value) =>
                        value === password || '密碼不一致',
                    })}
                    type="password"
                    autoComplete="new-password"
                    className="input-field pl-10"
                    placeholder="再次輸入密碼"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
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
                      註冊中...
                    </>
                  ) : (
                    '註冊'
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-gray-500">
                註冊即表示您同意我們的服務條款和隱私政策
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
