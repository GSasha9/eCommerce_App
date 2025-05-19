import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { Modal } from '../components/modals/modal';

let modal: Modal;

describe('Modal', () => {
  beforeEach(() => {
    modal = new Modal();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('provide a modal and add a wrapper to the DOM', async () => {
    const openPromise = modal.open();

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).not.toBeNull();
    });

    modal.close();
    await openPromise;
  });

  it('closes the modal and removes the wrapper from the DOM', async () => {
    const openPromise = modal.open();

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).not.toBeNull();
    });

    modal.close();

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).toBeNull();
    });

    await openPromise;
  });

  it('closes when clicked outside the modal window', async () => {
    const openPromise = modal.open();

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).not.toBeNull();
    });

    const overlay = document.querySelector('.wrapper-modal');

    if (!overlay) throw new Error('wrapper-modal not found');

    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).toBeNull();
    });

    await openPromise;
  });

  it('closes when pressing Escape', async () => {
    const openPromise = modal.open();

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).not.toBeNull();
    });

    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    await waitFor(() => {
      expect(document.querySelector('.wrapper-modal')).toBeNull();
    });

    await openPromise;
  });
});
