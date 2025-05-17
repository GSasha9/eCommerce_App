import Element from '../element';
import { Modal } from './modal';
import './modal.scss';

export class ModalMessage extends Modal {
  private content: Element<'div'>;
  private button: Element<'button'>;
  private message: string;
  private type: 'error' | 'info';

  constructor(message: string, type: 'error' | 'info') {
    super();
    this.message = message;
    this.type = type;
    this.button = new Element<'button'>({
      tag: 'button',
      className: 'button-close',
      textContent: 'CLOSE',
    });
    this.content = new Element<'div'>({
      tag: 'div',
      className: `content ${this.type === 'info' ? 'info' : 'error'}`,
      textContent: this.message,
    });

    this.modal.node.prepend(this.content.node, this.button.node);
    this.button.node.addEventListener('click', this.close);
  }
}
