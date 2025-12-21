import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToastStore } from '../../stores/toastStore';
import { Layout } from '../../components/layout/Layout';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

  const password = watch('password');

  useEffect(() => {
    // Check if we have the reset token
    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      showToast('無效的重設連結', 'error');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, showToast]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await authService.updatePassword(data.password);

      if (response.success) {
        showToast('密碼已成功更新！', 'success');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        showToast(response.error || '更新失敗，請稍後再試', 'error');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            重設密碼
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            請輸入您的新密碼
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  新密碼
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', {
                      required: '請輸入新密碼',
                      minLength: {
                        value: 6,
                        message: '密碼長度至少 6 個字元',
                      },
                    })}
                    type="password"
                    autoComplete="new-password"
                    className="input-field pl-10"
                    placeholder="輸入新密碼"
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
                  確認新密碼
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: '請確認新密碼',
                      validate: (value) =>
                        value === password || '密碼不一致',
                    })}
                    type="password"
                    autoComplete="new-password"
                    className="input-field pl-10"
                    placeholder="再次輸入新密碼"
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
                      更新中...
                    </>
                  ) : (
                    '更新密碼'
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

