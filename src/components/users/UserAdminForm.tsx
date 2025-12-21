import { useForm } from 'react-hook-form';
import type { UserProfile, UserRole } from '../../types/database';

interface UserFormData {
  full_name: string;
  role: UserRole;
  avatar_url: string;
}

interface UserAdminFormProps {
  user: UserProfile;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
}

export const UserAdminForm = ({ user, onSubmit, onCancel }: UserAdminFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    defaultValues: {
      full_name: user.full_name || '',
      role: user.role,
      avatar_url: user.avatar_url || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="input-field bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            {...register('full_name')}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            {...register('role', { required: true })}
            className="input-field"
          >
            <option value="guest">Guest</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-error text-sm mt-1">Role is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL
          </label>
          <input
            {...register('avatar_url')}
            type="url"
            className="input-field"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> User accounts are created through the authentication system. 
          You can only update user profile information here. To delete a user, use the Supabase dashboard.
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Update User
        </button>
      </div>
    </form>
  );
};

