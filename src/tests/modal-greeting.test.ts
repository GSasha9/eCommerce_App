import { describe, expect, it, vi } from 'vitest';

vi.mock('../components/modals/modal', () => ({
  Modal: vi.fn().mockImplementation(() => ({
    modal: {
      node: {
        prepend: vi.fn(),
      },
    },
  })),
}));

vi.mock('../element', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      node: document.createElement('div'),
    })),
  };
});

import { Modal } from '../components/modals/modal';
import { ModalGreeting } from '../components/modals/modal-greeting';

describe('ModalGreeting', () => {
  it('calls Modal constructor when initialized', () => {
    new ModalGreeting('Hello, world!');
    expect(Modal).toHaveBeenCalledTimes(1);
  });
});
