'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { FormType, GenericForm } from '@components/forms/GenericForm';
import { registerWithEmailAndPassword } from '@utils/firebase';
import { FormFields } from '@constants/formFields';

function FormSignUp() {
  const handleSubmit = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    await registerWithEmailAndPassword(name, email, password);
  };

  return (
    <GenericForm<FormType>
      formType="signUp"
      onSubmit={handleSubmit}
      fields={FormFields.signUp}
    />
  );
}

export default ProtectedRoute(FormSignUp, AuthRequirement.WithoutAuth);
