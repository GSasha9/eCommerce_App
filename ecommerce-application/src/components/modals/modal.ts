import { isHTMLElement } from '../../shared/models/typeguards.ts';
import Element from '../element';
import './modal.scss';

export class Modal {
  public message: Element<'p'>;
  protected modal: Element<'div'>;
  private wrapper: Element<'div'>;
  private button: Element<'button'>;
  private root = document.body;

  constructor(message: string) {
    this.message = new Element<'p'>({
      tag: 'p',
      className: 'modal-message',
      children: [],
      textContent: message,
    });
    this.button = new Element<'button'>({
      tag: 'button',
      className: 'button-close',
      textContent: 'close',
    });
    this.modal = new Element<'div'>({
      tag: 'div',
      className: 'modal',
      children: [this.message.node, this.button.node],
    });
    this.wrapper = new Element<'div'>({
      tag: 'div',
      className: 'wrapper-modal',
      children: [this.modal.node],
    });
    this.wrapper.node.addEventListener('click', this.closeOutsideClick);
    this.button.node.addEventListener('click', this.close);
  }

  public open(): void {
    this.root.append(this.wrapper.node);
    globalThis.addEventListener('keydown', this.closeEscape);
  }

  public close = (): void => {
    this.root.classList.toggle('.noScroll');
    this.wrapper.node.remove();
    globalThis.removeEventListener('keydown', this.closeEscape);
  };

  private closeOutsideClick = (event: MouseEvent): void => {
    if (isHTMLElement(event.target) && event.target.classList.contains('wrapper-modal')) {
      this.close();
    }
  };

  private closeEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };
}
