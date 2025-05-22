import type { IParameters } from '../../shared/models/interfaces/index.ts';
import { CreateElement } from '../../shared/utils/create-element.ts';
import { View } from '../view.ts';
import { CreateButton } from '../../components/button/create-button.ts';

export class NotFoundPage extends View {
  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'div', classNames: ['not-found-page'], ...parameters });
    this.create404Content();
  }

  private create404Content(): void {
    const container: CreateElement = new CreateElement({
      tag: 'section',
      classNames: ['not-found'],
      textContent: '',
      callback: (): void => {},
    });

    const message: CreateElement = new CreateElement({
      tag: 'h1',
      classNames: ['not-found__message'],
      textContent: '404 - Page Not Found',
      callback: (): void => {},
    });

    const homeButton: CreateButton = new CreateButton({
      classNames: ['not-found__button'],
      textContent: 'Go to Home',
      type: 'button',
      disabled: false,
      callback: (event: MouseEvent): void => {
        event.preventDefault();

        window.location.href = '/';
      },
    });

    container.addInnerElement(message.getElement());
    container.addInnerElement(homeButton.getElement());

    this.viewElementCreator.addInnerElement(container.getElement());
  }
}
