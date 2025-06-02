import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageModal } from '../components/modals/image-modal/image-modal';
import { Modal } from '../components/modals/modal';
import type { IImageModal, ISliderElementProperties } from '../shared/models/interfaces';
import * as genSliderElement from '../shared/utils/gen-slider-element';
import * as initSlider from '../shared/utils/init-slider';

describe('ImageModal', () => {
  const mockProperties: IImageModal = {
    images: ['image1.jpg', 'image2.jpg'],
    width: 300,
    alt: 'alt text',
    name: 'test-slider',
  };

  let genSliderSpy: MockInstance<(properties: ISliderElementProperties) => HTMLDivElement>;
  let initSliderSpy: ReturnType<typeof vi.spyOn>;

  let mockSliderDiv: HTMLDivElement;
  let mockCloseButton: HTMLButtonElement;

  beforeEach(() => {
    mockSliderDiv = document.createElement('div');
    mockSliderDiv.classList.add('mock-slider');

    mockCloseButton = document.createElement('button');
    mockCloseButton.classList.add('close-big-image-button');

    genSliderSpy = vi.spyOn(genSliderElement, 'genSliderElement').mockReturnValue(mockSliderDiv);

    initSliderSpy = vi.spyOn(initSlider, 'initSlider').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should extend Modal class', () => {
    const modal = new ImageModal(mockProperties);

    expect(modal).toBeInstanceOf(Modal);
  });

  it('should call genSliderElement with provided properties', () => {
    new ImageModal(mockProperties);
    expect(genSliderSpy).toHaveBeenCalledWith(mockProperties);
  });

  it('should call initSlider with correct parameters after timeout', () => {
    vi.useFakeTimers();

    new ImageModal(mockProperties);
    expect(initSliderSpy).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(initSliderSpy).toHaveBeenCalledWith({
      images: mockProperties.images,
      name: mockProperties.name,
    });

    vi.useRealTimers();
  });
});
