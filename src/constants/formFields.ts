import { FormFieldsType } from '@components/forms/GenericForm';

export const FormFields: FormFieldsType = {
  signUp: [
    { name: 'name' },
    { name: 'email' },
    { name: 'password', type: 'password' },
    { name: 'confirmPassword', type: 'password' },
  ],
  signIn: [{ name: 'email' }, { name: 'password', type: 'password' }],
};
