import { emailValidation } from './email-validation';
import { passwordValidation } from './password-validation';

export const formValidation = (): void => {
  const email = emailValidation();
  const password = passwordValidation();

  console.log(email, password);
};
