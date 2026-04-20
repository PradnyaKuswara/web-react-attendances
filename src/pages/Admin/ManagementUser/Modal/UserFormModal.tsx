import type { User, UserInput, UserUpdateInput } from '@/@types/user';
import SelectRole from '@/components/Select/SelectRole';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormValues = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  role_id: number | null;
  password?: string;
};

type Props = {
  isOpen: boolean;
  mode: 'create' | 'update';
  user?: User | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: UserInput | UserUpdateInput) => void;
};

const UserFormModal = ({ isOpen, mode, user, isSubmitting, onClose, onSubmit }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      position: '',
      role_id: null,
      password: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        position: user?.position || '',
        role_id: user?.role_id ?? null,
        password: '',
      });
    }
  }, [isOpen, user, reset]);

  const submitHandler = (values: FormValues) => {
    if (mode === 'create') {
      onSubmit({
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        role_id: values.role_id,
        password: values.password || '',
      } as UserInput);
      return;
    }

    const payload: UserUpdateInput = {
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      position: values.position,
      role_id: values.role_id ?? undefined,
    };

    if (values.password) {
      payload.password = values.password;
    }

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Tambah User' : 'Edit User'}
        </h3>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register('full_name', { required: 'Nama lengkap wajib diisi' })}
              />
              {errors.full_name && (
                <p className="text-error text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register('email', { required: 'Email wajib diisi' })}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register('position')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">Role</span>
              </label>

              <Controller
                name="role_id"
                control={control}
                rules={{ required: 'Role wajib dipilih' }}
                render={({ field }) => <SelectRole field={field} />}
              />

              {errors.role_id && (
                <p className="text-error text-sm mt-1">{errors.role_id.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text">
                  Password {mode === 'update' ? '(opsional)' : ''}
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                {...register('password', {
                  required: mode === 'create' ? 'Password wajib diisi' : false,
                })}
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" className="toggle toggle-primary" {...register('is_active')} />
            <span className="label-text">User aktif</span>
          </label> */}

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UserFormModal;