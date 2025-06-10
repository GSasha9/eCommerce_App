import { isHTMLElement } from '../../shared/models/typeguards.ts/index.ts';
import Element from '../element/index.ts';

import './styles.scss';

export class Modal {
  protected modal: Element<'div'>;
  protected wrapper: Element<'div'>;
  private root = document.body;
  private resolver?: () => void;

  constructor() {
    this.modal = new Element<'div'>({
      tag: 'div',
      className: 'modal',
    });
    this.wrapper = new Element<'div'>({
      tag: 'div',
      className: 'wrapper-modal',
      children: [this.modal.node],
    });
    this.wrapper.node.addEventListener('click', this.closeOutsideClick);
  }

  public open(): Promise<void> {
    this.root.append(this.wrapper.node);
    globalThis.addEventListener('keydown', this.closeEscape);
    this.root.classList.add('no-scroll');

    return new Promise<void>((resolve) => {
      this.resolver = resolve;
    });
  }

  public close = (): void => {
    this.root.classList.remove('no-scroll');
    this.wrapper.node.remove();
    globalThis.removeEventListener('keydown', this.closeEscape);

    if (this.resolver) {
      this.resolver();
      this.resolver = undefined;
    }
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
