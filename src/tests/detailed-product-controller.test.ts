import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageModal } from '../components/modals/image-modal/image-modal';
import { DetailedProductController } from '../controllers/detailed-product/detailed-product-controller';
import DetailedProductModel from '../model/detailed-product/detailed-product-model';

vi.mock('../pages/layout/layout', () => {
  return {
    Layout: {
      getInstance: (): { setMainContent: Mock } => ({
        setMainContent: vi.fn(),
      }),
    },
  };
});

vi.mock('../pages/detailed-product/detailed-product-page', () => {
  return {
    default: {
      getInstance: (): {
        renderPage: Mock<() => HTMLDivElement>;
        wrapperContent: HTMLDivElement;
      } => ({
        renderPage: vi.fn(() => document.createElement('div')),
        wrapperContent: document.createElement('div'),
      }),
    },
  };
});

vi.mock('../shared/utils/init-slider', () => ({
  initSlider: vi.fn(),
}));

vi.mock('../components/modals/image-modal/image-modal', () => {
  return {
    ImageModal: vi.fn().mockImplementation(() => ({
      open: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('DetailedProductController', () => {
  let controller: DetailedProductController;
  let model: DetailedProductModel;

  beforeEach(() => {
    model = DetailedProductModel.getInstance();
    model.clearQueryResults();
    model.getProductKeyByUrl = vi.fn(() => true);
    model.getDetailedInformation = vi.fn(() => Promise.resolve());
    controller = new DetailedProductController();
  });

  it('does nothing if event target is not HTMLElement', () => {
    const event = new Event('click');

    Object.defineProperty(event, 'target', {
      value: null,
    });

    controller.onClick(event);
    expect(ImageModal).not.toHaveBeenCalled();
  });

  it('opens modal on image click', () => {
    const img = document.createElement('img');

    img.id = 'modal-image detailed';

    const event = new MouseEvent('click', { bubbles: true });

    Object.defineProperty(event, 'target', {
      value: img,
    });

    model.response = {
      name: 'Test',
      img: ['img.jpg'],
      description: 'desc',
      fullDescription: 'full desc',
      prices: 1000,
      pricesFractionDigits: 2,
    };

    controller.onClick(event);

    expect(ImageModal).toHaveBeenCalledWith({
      images: ['img.jpg'],
      width: 150,
      alt: 'Test',
      name: 'big',
    });
  });
});
