import { isHTMLElement } from '../../shared/models/typeguards.ts';
import Element from '../element';
import './modal.scss';

export class Modal {
  protected modal: Element<'div'>;
  private wrapper: Element<'div'>;
  private root = document.body;

  constructor() {
    this.modal = new Element<'div'>({
      tag: 'div',
      className: 'modal',
      children: [],
    });
    this.wrapper = new Element<'div'>({
      tag: 'div',
      className: 'wrapper-modal',
      children: [this.modal.node],
    });
    this.wrapper.node.addEventListener('click', this.closeOutsideClick);
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
