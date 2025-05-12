import { CreateElement } from '../../../shared/utils/create-element';

export const emailValidation = (input: HTMLInputElement): boolean => {
  let isValid: boolean = true;

  if (input instanceof HTMLInputElement) {
    const inputContainer = input.parentElement;

    if (inputContainer) {
      inputContainer?.querySelectorAll('.error-message').forEach((el) => el.remove());
    }

    const value = input.value.trim();

    if (!/^[a-z0-9._%+-]+@[a-z.-]+\.[a-z]{2,}$/gi.test(value) || value === '') {
      const errorMessageOptions = {
        tag: 'p',
        classNames: ['error-message'],
        textContent: 'Enter a valid email address.',
        callback: (): void => {},
      };

      if (!value.includes('@')) {
        errorMessageOptions.textContent = 'Email address must include the @ symbol.';
      } else if (!input.value.substring(input.value.indexOf('@')).includes('.')) {
        errorMessageOptions.textContent = 'Enter the rest of the email address after the @ symbol.';
      } else {
        errorMessageOptions.textContent = 'Enter a valid email address.';
      }

      const errorMessage: CreateElement = new CreateElement(errorMessageOptions);

      inputContainer?.append(errorMessage.getElement());

      isValid = false;
    }
  } else {
    isValid = false;
  }

  return isValid;
};
