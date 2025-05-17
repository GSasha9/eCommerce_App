import { Modal } from '../modal';
import Element from '../../element';
import { CreateButton } from '../../button/create-button';
import './confirm-modal.scss';

export default class ConfirmModal extends Modal {
  private confirmButton: CreateButton;
  private cancelButton: CreateButton;
  private buttonsContainer: Element<'div'>;
  private action: () => void = () => {
    console.log(this);
  };

  constructor(message: string) {
    super(message);

    this.confirmButton = new CreateButton({
      classNames: ['modal__button', 'modal__confirm'],
      textContent: 'confirm',
      type: 'button',
      disabled: false,
    });

    this.cancelButton = new CreateButton({
      classNames: ['modal__button', 'modal__cancel'],
      textContent: 'cancel',
      type: 'button',
      disabled: false,
    });

    this.confirmButton.getElement().addEventListener('click', () => this.confirm());
    this.cancelButton.getElement().addEventListener('click', () => this.cancel());

    this.buttonsContainer = new Element<'div'>({
      tag: 'div',
      className: 'buttons-container',
      children: [this.confirmButton.getElement(), this.cancelButton.getElement()],
    });
    this.modal.node.appendChild(this.buttonsContainer.node);
  }

  public setAction(callback: () => void): void {
    this.action = callback;
  }

  private confirm(): void {
    this.action();
    this.close();
  }

  private cancel(): void {
    this.close();
  }
}
