'use client';

import ProtectedRoute, { AuthRequirement } from '@components/protectedRoute/ProtectedRoute';
import { FormType, GenericForm } from '@components/forms/GenericForm';
import { logInWithEmailAndPassword } from '@utils/firebase';
import { FormFields } from '@constants/formFields';

function FormSignIn() {
  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    await logInWithEmailAndPassword(email, password);
  };

  return (
    <GenericForm<FormType>
      formType="signIn"
      onSubmit={handleSubmit}
      fields={FormFields.signIn}
    />
  );
}

export default ProtectedRoute(FormSignIn, AuthRequirement.WithoutAuth);
