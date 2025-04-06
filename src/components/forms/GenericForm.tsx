'use client';

import { FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { UIButton } from '@ui/UIButton';
import { UILink } from '@ui/UILink';
import { RoutePaths } from '@constants/routePaths';
import { UIFormInput } from '@ui/UIFormInput';
import { ReactNode, useState } from 'react';
import { notifyError } from '@utils/notify';
import { signInValidationSchema, signUpValidationSchema } from '@utils/validationSchemes';

export type FormType = 'signIn' | 'signUp';

export type FormSignInType = {
  email: string;
  password: string;
};

export type FormSignUpType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormConfig<T extends FormType> = {
  formType: T;
  onSubmit: T extends 'signIn' ? SubmitHandler<FormSignInType> : SubmitHandler<FormSignUpType>;
  fields: T extends 'signIn' ? FormField<FormSignInType>[] : FormField<FormSignUpType>[];
  children?: ReactNode;
};

export type FormField<T extends FieldValues> = {
  name: Path<T>;
  type?: React.HTMLInputTypeAttribute;

  required?: boolean;
};

export type FormFieldsType = {
  signIn: FormField<FormSignInType>[];
  signUp: FormField<FormSignUpType>[];
};
export const GenericForm = <T extends FormType>({ formType, onSubmit, fields, children }: FormConfig<T>) => {
  const t = useTranslations(formType === 'signIn' ? 'SignInForm' : 'SignUpForm');
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = formType === 'signIn' ? signInValidationSchema : signUpValidationSchema;

  const getErrorMessage = (fieldName: string): string | undefined => {
    const error = errors[fieldName as keyof (FormSignInType | FormSignUpType)];

    return error?.message;
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormSignInType | FormSignUpType>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const handleFormSubmit: SubmitHandler<FormSignInType | FormSignUpType> = async (data) => {
    setIsLoading(true);
    try {
      if (formType === 'signIn') {
        await (onSubmit as SubmitHandler<FormSignInType>)(data as FormSignInType);
      } else {
        await (onSubmit as SubmitHandler<FormSignUpType>)(data as FormSignUpType);
      }
    } catch (error) {
      if (error instanceof Error) notifyError(t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 mt-3">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h2 className="text-3xl font-bold text-center mb-4">{t('title')}</h2>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-md"
        >
          {fields.map((field) => (
            <UIFormInput
              key={field.name}
              name={field.name}
              type={field.type ?? 'text'}
              placeholder={t(field.name)}
              required={field.required ?? true}
              register={register}
              error={getErrorMessage(field.name)}
            />
          ))}
          {children}
          <UIButton
            text={isLoading ? t('loading') : t('submitButtonText')}
            type="submit"
            disabled={!isValid}
            className="w-full p-2 font-semibold"
          />
        </form>
        <p className="mt-4 mb-2 text-center">{t('common.questionText')}</p>
        <UILink
          text={t('common.linkText')}
          href={formType === 'signIn' ? RoutePaths.SIGNUP : RoutePaths.SIGNIN}
          className="text-blue-500 font-semibold"
        />
      </div>
    </div>
  );
};
