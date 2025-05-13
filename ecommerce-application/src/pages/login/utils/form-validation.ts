import { emailValidation } from './email-validation';
import { passwordValidation } from './password-validation';

export const formValidation = (email: HTMLInputElement, password: HTMLInputElement): boolean => {
  if (!emailValidation(email) || !passwordValidation(password)) {
    return false;
  } else {
    return true;
  }
};
