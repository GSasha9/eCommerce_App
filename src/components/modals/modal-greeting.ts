import Element from '../element';
import { Modal } from './modal';

import './styles.scss';

export class ModalGreeting extends Modal {
  private content: Element<'div'>;
  private button: Element<'button'>;
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
    this.button = new Element<'button'>({
      tag: 'button',
      className: 'button-close',
      textContent: 'Ok',
    });
    this.content = new Element<'div'>({
      tag: 'div',
      className: 'content info',
      textContent: this.message,
    });

    this.modal.node.prepend(this.content.node, this.button.node);
    this.button.node.addEventListener('click', this.close);
  }
}
