import Element from '../element';
import { Modal } from './modal';
import './modal.scss';

export class ErrorModal extends Modal {
  private content: Element<'div'>;
  private message: string;

  constructor(message: string) {
    super();
    this.message = message;
    this.content = new Element<'div'>({
      tag: 'div',
      className: 'content',
      textContent: this.message,
    });

    this.modal.node.prepend(this.content.node);
  }
}
