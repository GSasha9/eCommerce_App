import { emailValidation } from './email-validation';
import { passwordValidation } from './password-validation';

export const formValidation = (email: HTMLInputElement, password: HTMLInputElement): void => {
  if (!emailValidation(email) || !passwordValidation(password)) {
    return;
  } else {
    const user = {
      email: email.value,
      password: password.value,
    };

    console.log(user);
  }
};
