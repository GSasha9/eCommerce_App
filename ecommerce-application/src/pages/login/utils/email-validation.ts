import { CreateElement } from '../../../shared/utils/create-element';

export const emailValidation = (event?: Event): boolean => {
  let flag: boolean = true;

  const input = event?.target;

  if (input instanceof HTMLInputElement) {
    const inputContainer = input.parentElement;

    if (inputContainer) {
      inputContainer?.querySelectorAll('.error-message').forEach((el) => el.remove());
      flag = true;
    }

    if (input.value.trim() === '') return false;

    if (!/^[a-z0-9._%+-]+@[a-z.-]+\.[a-z]{2,}$/gi.test(input.value.trim())) {
      const errorMessageOptions = {
        tag: 'p',
        classNames: ['error-message'],
        textContent: '',
        callback: (): void => {},
      };

      if (!input.value.includes('@')) {
        errorMessageOptions.textContent = 'Email address must include the @ symbol.';
      } else if (!input.value.substring(input.value.indexOf('@')).includes('.')) {
        errorMessageOptions.textContent = 'Enter the rest of the email address after the @ symbol.';
      } else {
        errorMessageOptions.textContent = 'Enter a valid email address.';
      }

      const errorMessage: CreateElement = new CreateElement(errorMessageOptions);

      input.parentElement?.append(errorMessage.getElement());

      flag = false;
    }
  }

  return flag;
};
