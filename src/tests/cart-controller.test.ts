import type { Cart, ClientResponse } from '@commercetools/platform-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CartController } from '../controllers/cart/cart-controller.ts';

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

vi.mock('../shared/models/typeguards.ts', () => ({
  isHTMLElement: (el: HTMLElement): boolean => el?.nodeType === 1,
  isHTMLButtonElement: (el: HTMLElement): boolean => el?.tagName === 'BUTTON',
  isHTMLInputElement: (el: HTMLElement): boolean => el?.tagName === 'INPUT',
  isTokenStore: (): boolean => true,
}));

const mockExecute = vi.fn(
  (): DeepPartial<ClientResponse<Cart>> => ({ body: { id: 'cart123', lineItems: [{ id: 'item1' }] } }),
);
const mockPost = vi.fn(() => ({ execute: mockExecute }));

vi.mock('../commerce-tools/auth-service.ts', () => ({
  authService: {
    api: {
      carts: vi.fn(() => ({
        withId: vi.fn(() => ({
          post: mockPost,
        })),
      })),
    },
  },
}));

vi.mock('../commerce-tools/cart/cart-service.ts', () => ({
  CartService: {
    getDiscount: vi.fn(),
  },
}));

vi.mock('../components/modals/modal-confirm.ts', () => {
  return {
    ModalConfirm: vi.fn().mockImplementation(() => ({
      open: (): Promise<boolean> => Promise.resolve(true),
    })),
  };
});

vi.mock('../model/cart/cart-model', () => {
  return {
    default: {
      getInstance: vi.fn(() => ({
        cart: {
          id: 'cart123',
          version: 1,
          lineItems: [{ id: 'item1' }],
        },
        getCartInformation: vi.fn(),
      })),
    },
  };
});

vi.mock('../pages/cart/cart-page', () => {
  return {
    default: {
      getInstance: vi.fn(() => ({
        wrapperContent: {
          addEventListener: vi.fn(),
        },
        coupon: {
          querySelector: (): unknown => ({ value: 'SAVE10', tagName: 'INPUT' }),
        },
        renderPage: vi.fn(),
        renderEmptyCart: vi.fn(),
        renderErrorMessage: vi.fn(),
      })),
    },
  };
});

vi.mock('../pages/layout/layout', () => ({
  Layout: {
    getInstance: vi.fn(() => ({
      setMainContent: vi.fn(),
    })),
  },
}));

vi.mock('../shared/utils/update-countItems-cart.ts', () => ({
  updateCountItemsCart: vi.fn(),
}));

describe('CartController', () => {
  let controller: CartController;

  beforeEach(() => {
    controller = new CartController();
  });

  it('created correctly', () => {
    expect(controller).toBeInstanceOf(CartController);
  });

  it('calls applyCoupon() with a successful result', async () => {
    const input = document.createElement('input');

    input.name = 'coupon';
    input.value = 'TEST';

    await controller.applyCoupon(input);

    expect(input.value).toBe('');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new CartController();
  });

  it('should attach click listener on initListeners', () => {
    const addEventListenerSpy = vi.spyOn(controller.page.wrapperContent, 'addEventListener');

    controller.initListeners();
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should call decreaseQuantityProduct when minus button clicked', () => {
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'minus',
        dataset: { lineItemId: 'item1', quantity: '2' },
      },
    });

    const decreaseSpy = vi.spyOn(controller, 'decreaseQuantityProduct').mockResolvedValue();

    controller.onClick(mockEvent);
    expect(decreaseSpy).toHaveBeenCalledWith('item1', '2');
  });

  it('should call increaseQuantityProduct when plus button clicked', () => {
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'plus',
        dataset: { lineItemId: 'item1', quantity: '2' },
      },
    });

    const increaseSpy = vi.spyOn(controller, 'increaseQuantityProduct').mockResolvedValue();

    controller.onClick(mockEvent);
    expect(increaseSpy).toHaveBeenCalledWith('item1', '2');
  });

  it('should call removeProductFromCart when remove button clicked', () => {
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'remove',
        dataset: { lineItemId: 'item1' },
      },
    });

    const removeSpy = vi.spyOn(controller, 'removeProductFromCart').mockResolvedValue();

    controller.onClick(mockEvent);
    expect(removeSpy).toHaveBeenCalledWith('item1');
  });

  it('should call removeAll when remove-all button clicked and confirmed', async () => {
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'remove-all',
      },
    });

    const renderPageSpy = vi.spyOn(controller.page, 'renderPage');
    const updateCountSpy = (await import('../shared/utils/update-countItems-cart.ts')).updateCountItemsCart;
    const checkEmptySpy = vi.spyOn(controller, 'checkForEmptyBasket');

    controller.onClick(mockEvent);
    await controller.removeAll();

    expect(renderPageSpy).toHaveBeenCalled();
    expect(updateCountSpy).toHaveBeenCalled();
    expect(checkEmptySpy).toHaveBeenCalled();
  });

  it('should apply coupon when apply-coupon button clicked', () => {
    const inputMock = { value: 'SAVE10', tagName: 'INPUT' };
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'apply-coupon',
      },
    });

    const applySpy = vi.spyOn(controller, 'applyCoupon').mockResolvedValue();

    controller.onClick(mockEvent);
    expect(applySpy).toHaveBeenCalledWith(inputMock);
  });

  it('should remove coupon error message when coupon-error-button clicked', () => {
    const mockEvent = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(mockEvent, 'target', {
      value: {
        nodeType: 1,
        tagName: 'BUTTON',
        name: 'coupon-error-button',
      },
    });

    controller.onClick(mockEvent);
    const messageNode = document.querySelector('.coupon-error-wrapper')!;

    expect(messageNode).toBeNull();
  });

  it('removeCode calls authService and updates model', async () => {
    mockExecute.mockResolvedValue({ body: { id: 'cartAfterRemoveCode', lineItems: [] } });

    await controller.removeCode('codeId123');

    expect(controller.model.cart).toEqual({ id: 'cartAfterRemoveCode', lineItems: [] });
  });
});
