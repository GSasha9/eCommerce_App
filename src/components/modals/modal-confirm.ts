import { isHTMLElement } from '../../shared/models/typeguards.ts/index.ts';
import { genElement } from '../../shared/utils/gen-element.ts';

import './styles.scss';

export class ModalConfirm {
  protected modal: HTMLElement;
  protected wrapper: HTMLElement;
  protected cancelButton: HTMLElement;
  protected confirmButton: HTMLElement;
  protected buttonWrapper: HTMLElement;
  private root = document.body;
  private resolver?: (value: boolean) => void;

  constructor() {
    const content = genElement('div', { className: 'content-modal' }, [
      'Are you sure you want to delete all items in the basket?',
    ]);

    this.cancelButton = genElement('button', { className: 'modal-close-button' }, ['close']);
    this.confirmButton = genElement('button', { className: 'modal-confirm-button' }, ['confirm']);
    this.buttonWrapper = genElement('div', { className: 'modal-button-wrapper' }, [
      this.cancelButton,
      this.confirmButton,
    ]);
    this.modal = genElement('div', { className: 'modal' }, [content, this.buttonWrapper]);
    this.wrapper = genElement('div', { className: 'wrapper-modal' }, [this.modal]);

    this.wrapper.addEventListener('click', this.closeOutsideClick);
    this.cancelButton.addEventListener('click', this.cancel);
    this.confirmButton.addEventListener('click', this.confirm);
  }

  public cancel = (): void => {
    this.close();

    if (this.resolver) {
      this.resolver(false);
      this.resolver = undefined;
    }
  };

  public confirm = (): void => {
    this.close();

    if (this.resolver) {
      this.resolver(true);
      this.resolver = undefined;
    }
  };

  public open(): Promise<boolean> {
    this.root.append(this.wrapper);
    globalThis.addEventListener('keydown', this.closeEscape);
    this.root.classList.add('no-scroll');

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  public close = (): void => {
    this.root.classList.remove('no-scroll');
    this.wrapper.remove();
    globalThis.removeEventListener('keydown', this.closeEscape);

    // if (this.resolver) {
    //   this.resolver();
    //   this.resolver = undefined;
    // }
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
