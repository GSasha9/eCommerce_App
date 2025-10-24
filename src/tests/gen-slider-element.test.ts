import { describe, expect, it } from 'vitest';

import type { ISliderElementProperties } from '../shared/models/interfaces/index';
import { genSliderElement } from '../shared/utils/gen-slider-element';

describe('genSliderElement', () => {
  const baseProps: ISliderElementProperties = {
    images: ['img1.jpg', 'img2.jpg'],
    width: 300,
    alt: 'image alt',
    name: 'product-slider',
  };

  it('should create main slider container with correct classes', () => {
    const el = genSliderElement(baseProps);

    expect(el.className).toContain('swiper');
    expect(el.className).toContain('product-slider');
  });

  it('should create correct number of slides', () => {
    const el = genSliderElement(baseProps);
    const slides = el.querySelectorAll('.swiper-slide');

    expect(slides.length).toBe(baseProps.images.length);
  });

  it('should contain an img inside each slide with correct attributes', () => {
    const el = genSliderElement(baseProps);
    const imgs = el.querySelectorAll('img');

    imgs.forEach((img, i) => {
      expect(img).toBeInstanceOf(HTMLImageElement);
      expect(img.getAttribute('src')).toBe(baseProps.images[i]);
      expect(img.getAttribute('alt')).toBe(baseProps.alt);
      expect(img.width).toBe(baseProps.width);
      expect(img.height).toBe(baseProps.width);
      expect(img.className).toContain(baseProps.name);
    });
  });

  it('should contain pagination element', () => {
    const el = genSliderElement(baseProps);
    const pagination = el.querySelector('.swiper-pagination');

    expect(pagination).not.toBeNull();
  });

  it('should include navigation buttons if more than one image', () => {
    const el = genSliderElement(baseProps);

    expect(el.querySelector('.swiper-button-next')).not.toBeNull();
    expect(el.querySelector('.swiper-button-prev')).not.toBeNull();
  });

  it('should not include navigation buttons if only one image', () => {
    const singleImageProps = { ...baseProps, images: ['img1.jpg'] };
    const el = genSliderElement(singleImageProps);

    expect(el.querySelector('.swiper-button-next')).toBeNull();
    expect(el.querySelector('.swiper-button-prev')).toBeNull();
  });
});
