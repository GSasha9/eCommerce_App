import Element from '../element';
import { Modal } from './modal';
import './modal.scss';

export class ModalMessage extends Modal {
  private content: Element<'div'>;
  private button: Element<'button'>;
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
    this.button = new Element<'button'>({
      tag: 'button',
      className: 'button-close',
      textContent: 'CLOSE',
    });
    this.content = new Element<'div'>({
      tag: 'div',
      className: 'content error',
      textContent: this.message,
    });

    this.modal.node.prepend(this.content.node, this.button.node);
    this.button.node.addEventListener('click', this.close);
  }
}
