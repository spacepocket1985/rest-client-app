'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { logInWithEmailAndPassword } from '@utils/firebase';
import { RoutePaths } from 'src/constants/routePaths';

export type SignInFormType = {
  email: string;
  password: string;
};

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormType>({
    mode: 'onChange',
  });

  const logInUser: SubmitHandler<SignInFormType> = async ({ email, password }) => {
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4"> {'Sign in'}</h2>
        <form
          onSubmit={handleSubmit(logInUser)}
          className="space-y-4"
        >
          <input
            type="text"
            {...register('email')}
            placeholder={'Email'}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            {...register('password')}
            placeholder={'Password'}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 text-white font-semibold rounded-md   
              ${!isValid ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {'Don’t have an account?'}
          <Link
            href={RoutePaths.SIGNUP}
            className="text-blue-500 font-semibold hover:underline"
          >
            {'Register'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ProtectedRoute(SignIn, AuthRequirement.WithoutAuth);
