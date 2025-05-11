export const eyeCallback = (event: MouseEvent): void => {
  if (event.target instanceof HTMLElement) {
    const container = event.target.closest('.form__inputbox--password');
    const containerElements = container?.childNodes;

    if (containerElements) {
      const input = [...containerElements].find((element) => element instanceof HTMLInputElement);

      if (input && input instanceof HTMLInputElement) {
        const inputType = input.getAttribute('type');

        if (inputType === 'password') {
          input.setAttribute('type', 'text');
          event.target.classList.remove('eye-close');
          event.target.classList.add('eye-open');
        } else {
          input.setAttribute('type', 'password');
          event.target.classList.remove('eye-open');
          event.target.classList.add('eye-close');
        }
      } else {
        throw new Error('There are no input');
      }
    } else {
      throw new Error('There are no siblings elements');
    }
  }
};
