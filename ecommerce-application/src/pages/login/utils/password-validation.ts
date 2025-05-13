import { CreateElement } from '../../../shared/utils/create-element';

export const passwordValidation = (input: HTMLInputElement): boolean => {
  let isValid: boolean = true;

  if (input instanceof HTMLInputElement) {
    const inputContainer = input.parentElement;

    if (inputContainer) {
      inputContainer?.querySelectorAll('.error-message').forEach((el) => el.remove());
    }

    const value = input.value.trim();

    const inputLength = input.value.length;

    if (inputLength < 8 || value === '') {
      const errorMessageOptions = {
        tag: 'p' as const,
        classNames: ['error-message'],
        textContent: '',
        callback: (): void => {},
      };

      if (inputLength < 8 || value === '') {
        errorMessageOptions.textContent = 'Password must be at least 8 characters long';
      } else if (!/[A-Z]{1,}/.test(value)) {
        errorMessageOptions.textContent = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]{1,}/.test(value)) {
        errorMessageOptions.textContent = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]{1,}/.test(value)) {
        errorMessageOptions.textContent = 'Password must contain at least one digit';
      } else if (!/[!@#$%^&*]{1,}/.test(value)) {
        errorMessageOptions.textContent = 'Password must contain at least one special character';
      } else if (/\s/g.test(input.value)) {
        errorMessageOptions.textContent = 'Password must not contain leading or trailing whitespace';
      }

      const errorMessage: CreateElement = new CreateElement(errorMessageOptions);

      input.parentElement?.append(errorMessage.getElement());

      isValid = false;
    }
  } else {
    isValid = false;
  }

  return isValid;
};
