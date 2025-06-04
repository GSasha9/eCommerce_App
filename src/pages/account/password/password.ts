import { authService } from '../../../commerce-tools/auth-service.ts';
import { CustomerProfileService } from '../../../commerce-tools/customer-profile-service/customer-profile-service.ts';
import { CreateInput } from '../../../components/input/create-input.ts';
import { ModalGreeting } from '../../../components/modals/modal-greeting.ts';
import { route } from '../../../router';
import { MESSAGE_CONTENT } from '../../../shared/constants/messages-for-validator.ts';
import type { IParameters } from '../../../shared/models/interfaces';
import { CreateElement } from '../../../shared/utils/create-element.ts';
import { UserState } from '../../../state/customer-state.ts';
import { Header } from '../../layout/header.ts';

import './style.scss';

export class ChangePasswordModal extends CreateElement {
  private currentPasswordInput: CreateInput;
  private newPasswordInput: CreateInput;
  private confirmPasswordInput: CreateInput;
  private currentPwdToggle: CreateElement;
  private newPwdToggle: CreateElement;
  private confirmPwdToggle: CreateElement;
  private errorContainer: CreateElement;
  private saveButton: CreateElement;
  private cancelButton: CreateElement;

  constructor(parameters: Partial<IParameters> = {}) {
    super({ tag: 'dialog', classNames: ['change-password-modal'], ...parameters });

    const contentContainer = new CreateElement({
      tag: 'div',
      classNames: ['modal-content'],
    });

    const title = new CreateElement({
      tag: 'h2',
      textContent: 'Change Password',
      classNames: ['modal-title'],
    });

    this.currentPasswordInput = new CreateInput({
      classNames: ['input-current-password'],
      placeholder: 'Current Password',
      id: 'current-password',
      name: 'currentPassword',
      type: 'password',
    });
    this.newPasswordInput = new CreateInput({
      classNames: ['input-new-password'],
      placeholder: 'New Password',
      id: 'new-password',
      name: 'newPassword',
      type: 'password',
    });
    this.confirmPasswordInput = new CreateInput({
      classNames: ['input-confirm-password'],
      placeholder: 'Confirm New Password',
      id: 'confirm-password',
      name: 'confirmPassword',
      type: 'password',
      // callback: (event: InputEvent):void => {
      //   const input = event.target;

      //   if(input instanceof HTMLInputElement) {
      //     Validator.isPassword(input.value)
      //   }
      // }
    });

    this.currentPwdToggle = new CreateElement({
      tag: 'button',
      textContent: 'Show',
      classNames: ['btn-toggle'],
      callback: (evt: Event): void => {
        evt.preventDefault();
        ChangePasswordModal.togglePasswordVisibility(this.currentPasswordInput, this.currentPwdToggle);
      },
    });
    this.newPwdToggle = new CreateElement({
      tag: 'button',
      textContent: 'Show',
      classNames: ['btn-toggle'],
      callback: (evt: Event): void => {
        evt.preventDefault();
        ChangePasswordModal.togglePasswordVisibility(this.newPasswordInput, this.newPwdToggle);
      },
    });
    this.confirmPwdToggle = new CreateElement({
      tag: 'button',
      textContent: 'Show',
      classNames: ['btn-toggle'],
      callback: (evt: Event): void => {
        evt.preventDefault();
        ChangePasswordModal.togglePasswordVisibility(this.confirmPasswordInput, this.confirmPwdToggle);
      },
    });

    const currentPwdContainer = new CreateElement({
      tag: 'div',
      classNames: ['input-container'],
    });

    currentPwdContainer.addInnerElement([this.currentPasswordInput, this.currentPwdToggle]);

    const newPwdContainer = new CreateElement({
      tag: 'div',
      classNames: ['input-container'],
    });

    newPwdContainer.addInnerElement([this.newPasswordInput, this.newPwdToggle]);

    const confirmPwdContainer = new CreateElement({
      tag: 'div',
      classNames: ['input-container'],
    });

    confirmPwdContainer.addInnerElement([this.confirmPasswordInput, this.confirmPwdToggle]);

    this.errorContainer = new CreateElement({
      tag: 'div',
      classNames: ['error-message'],
      textContent: '',
    });

    this.saveButton = new CreateElement({
      tag: 'button',
      textContent: 'Save',
      classNames: ['btn', 'btn-save'],
      callback: (evt: Event): void => {
        evt.preventDefault();
        void this.onSave();
      },
    });

    this.cancelButton = new CreateElement({
      tag: 'button',
      textContent: 'Cancel',
      classNames: ['btn', 'btn-cancel'],
      callback: (evt: Event): void => {
        evt.preventDefault();
        this.onCancel();
      },
    });

    contentContainer.addInnerElement([
      title,
      currentPwdContainer,
      newPwdContainer,
      confirmPwdContainer,
      this.errorContainer,
      this.saveButton,
      this.cancelButton,
    ]);

    this.addInnerElement([contentContainer]);

    const newPwdEl = this.newPasswordInput.getElement();
    const confirmPwdEl = this.confirmPasswordInput.getElement();

    const currPass = this.currentPasswordInput.getElement();

    if (currPass instanceof HTMLInputElement) {
      currPass.addEventListener('input', () => {
        if (currPass.value.length < 8 || !/\d/.test(currPass.value)) {
          this.errorContainer.getElement().textContent =
            MESSAGE_CONTENT.password || 'New password must be at least 8 characters and contain a number.';

          return;
        }
      });
    }

    if (newPwdEl instanceof HTMLInputElement && confirmPwdEl instanceof HTMLInputElement) {
      newPwdEl.addEventListener('input', () => this.handleRealTimeValidation());
      confirmPwdEl.addEventListener('input', () => this.handleRealTimeValidation());
    }
  }

  private static togglePasswordVisibility(input: CreateInput, toggleBtn: CreateElement): void {
    const inputEl = input.getElement();

    if (inputEl instanceof HTMLInputElement) {
      if (inputEl.type === 'password') {
        inputEl.type = 'text';
        toggleBtn.getElement().textContent = 'Hide';
      } else {
        inputEl.type = 'password';
        toggleBtn.getElement().textContent = 'Show';
      }
    }
  }

  private handleRealTimeValidation(): void {
    const newPwdEl = this.newPasswordInput.getElement();
    const confirmPwdEl = this.confirmPasswordInput.getElement();

    if (!(newPwdEl instanceof HTMLInputElement && confirmPwdEl instanceof HTMLInputElement)) {
      return;
    }

    if (newPwdEl.value.length < 8 || !/\d/.test(newPwdEl.value)) {
      this.errorContainer.getElement().textContent =
        MESSAGE_CONTENT.password || 'New password must be at least 8 characters and contain a number.';

      return;
    }

    if (newPwdEl.value !== confirmPwdEl.value) {
      this.errorContainer.getElement().textContent = 'New passwords do not match.';

      return;
    }

    this.errorContainer.getElement().textContent = '';
  }

  private async onSave(): Promise<void> {
    const currentPwdEl = this.currentPasswordInput.getElement();
    const newPwdEl = this.newPasswordInput.getElement();
    const confirmPwdEl = this.confirmPasswordInput.getElement();

    if (
      !(
        currentPwdEl instanceof HTMLInputElement &&
        newPwdEl instanceof HTMLInputElement &&
        confirmPwdEl instanceof HTMLInputElement
      )
    ) {
      return;
    }

    if (!currentPwdEl.value || !newPwdEl.value || !confirmPwdEl.value) {
      this.errorContainer.getElement().textContent = 'All fields are required.';

      return;
    }

    if (newPwdEl.value.length < 8 || !/\d/.test(newPwdEl.value)) {
      this.errorContainer.getElement().textContent =
        MESSAGE_CONTENT.password || 'New password must be at least 8 characters and contain a number.';

      return;
    }

    if (newPwdEl.value !== confirmPwdEl.value) {
      this.errorContainer.getElement().textContent = 'New passwords do not match.';

      return;
    }

    const id = localStorage.getItem('ct_user_token');

    if (!id) return;

    const user = UserState.getInstance().customer;

    if (!user) return;

    const payload = {
      version: user.version,
      currentPassword: currentPwdEl.value,
      newPassword: newPwdEl.value,
    };

    try {
      const response = await CustomerProfileService.changeMyPassword(payload);

      if (response) {
        authService.isAuthenticated = false;
        localStorage.removeItem('ct_user_token');
        localStorage.removeItem('ct_anon_token');
        localStorage.removeItem('ct_user_credentials');

        UserState.getInstance().customer = undefined;

        await authService.refreshAnonymousToken();

        route.navigate('/login');
      }
    } catch (error) {
      this.errorContainer.getElement().textContent = `Password update failed: ${String(error)}`;

      return;
    }

    this.close();

    const modal = new ModalGreeting('Password changed successfully. Please log in again with your new credentials.');

    void (await modal.open());
    Header.switchBtn();
    const logout = document.querySelector<HTMLElement>('.header__button--login');

    if (logout?.classList.contains('logout')) logout?.classList.remove('logout');
  }

  private onCancel(): void {
    this.close();
  }

  public open(): void {
    const dialogEl: unknown = this.getElement();

    if (dialogEl instanceof HTMLDialogElement) {
      if (!dialogEl.isConnected) {
        document.body.appendChild(dialogEl);
      }

      dialogEl.showModal();
    }
  }

  public close(): void {
    const dialogEl: unknown = this.getElement();

    try {
      if (dialogEl instanceof HTMLDialogElement && typeof dialogEl.close === 'function') {
        dialogEl.close();
      }
    } catch (error) {
      console.warn(error);
    }

    if (dialogEl instanceof HTMLElement && dialogEl.parentElement) {
      dialogEl.parentElement.removeChild(dialogEl);
    } else if (dialogEl instanceof HTMLElement) {
      dialogEl.remove();
    }
  }
}
