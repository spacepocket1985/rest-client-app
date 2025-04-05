import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { EyeIcon } from '@components/icons/EyeIcon';
import { EyeOffIcon } from '@components/icons/EyeOffIcon';

type UiFormInputProps<T extends FieldValues> = {
  type?: React.HTMLInputTypeAttribute;
  name: Path<T>;
  required: boolean;
  register: UseFormRegister<T>;
  placeholder?: string;
  error?: string | undefined;
  showPasswordToggle?: boolean;
};

export const UIFormInput = <T extends FieldValues>({
  type = 'text',
  name,
  register,
  required,
  placeholder,
  error,
  showPasswordToggle = true,
}: UiFormInputProps<T>): JSX.Element => {
  const t = useTranslations('Validation');
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPasswordToggle && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <label
      htmlFor={name}
      className="block mb-8 w-full relative"
    >
      <input
        id={name}
        autoComplete={isPasswordField ? 'on' : 'off'}
        type={inputType}
        className={`w-full p-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isPasswordField && showPasswordToggle ? 'pr-10' : ''
        }`}
        placeholder={placeholder}
        {...register(name, { required })}
      />

      {isPasswordField && showPasswordToggle && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ?
            <EyeIcon />
          : <EyeOffIcon />}
        </button>
      )}

      {error && <p className="mt-2 text-[12px] text-red-600 h-7">{t(`${error}`)}</p>}
    </label>
  );
};
