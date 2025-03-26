/* eslint-disable react-refresh/only-export-components */
'use client';

import ProtectedRoute from '@components/protectedRoute/ProtectedRoute';
import { registerWithEmailAndPassword } from '@utils/firebase';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RoutePaths } from 'src/constants/routePaths';

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

  const registerUser: SubmitHandler<SignUpFormType> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(registerUser)} className="space-y-4">
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
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full p-2 text-white font-semibold rounded-md   
              ${!isValid ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {'Already have an account? '}
          <Link
            href={RoutePaths.SIGNIN}
            className="text-blue-500 font-semibold hover:underline"
          >
            {'Login'}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ProtectedRoute(SignUp);
