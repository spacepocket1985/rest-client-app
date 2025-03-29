'use client';

import { SubmitHandler, useForm } from 'react-hook-form';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { registerWithEmailAndPassword } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';
import { UIButton } from '@ui/UIButton';
import { UILink } from '@ui/UILink';

type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormType>({
    mode: 'onChange',
  });

  const registerUser: SubmitHandler<SignUpFormType> = async ({ name, email, password }) => {
    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{'Sign Up'}</h2>
        <form
          onSubmit={handleSubmit(registerUser)}
          className="space-y-4"
        >
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            {...register('name')}
            placeholder={'name'}
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            {...register('email')}
            placeholder={'email'}
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            {...register('password')}
            placeholder={'password'}
            required
          />
          <UIButton
            text={'Sign up'}
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 font-semibold`}
          />
        </form>
        <p className="mt-4 text-center">
          {'Already have an account? '}
          <UILink
            text={'Login'}
            href={RoutePaths.SIGNIN}
            className="text-blue-500 font-semibold hover:underline"
          />
        </p>
      </div>
    </div>
  );
}

export default ProtectedRoute(SignUp, AuthRequirement.WithoutAuth);
