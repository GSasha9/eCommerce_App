import { genElement } from './gen-element.ts';

export interface ISliderElementProperties {
  images?: string[];
  width: number;
  alt: string;
  name: string;
  title: string[];
  bio: string[];
  roles: string[];
  contribution: string[];
  github: string[];
}

export function genSliderElementAbout(properties: ISliderElementProperties): HTMLDivElement {
  const { images, width, alt, name, title, bio, roles, contribution, github } = properties;
  const imagesArray = images ?? [];
  const getSlideText = (i: number, data: string[]): string => (Array.isArray(data) ? data[i] || '' : data || '');

  const slider = genElement('div', { className: `swiper about-slider` });
  const wrapper = genElement('div', { className: 'swiper-wrapper' });

  imagesArray.forEach((img, idx): void => {
    const titleSlide = genElement('h3', { className: 'slide-text text-description' });

    titleSlide.textContent = getSlideText(idx, title);

    const bioSlide = genElement('p', { className: 'slide-text text-description' });

    bioSlide.textContent = getSlideText(idx, bio);

    const rolesSlide = genElement('h4', { className: 'slide-text text-description' });

    rolesSlide.textContent = getSlideText(idx, roles);

    const constibutionSlide = genElement('p', { className: 'slide-text text-description' });

    constibutionSlide.textContent = getSlideText(idx, contribution);

    const githubSlide = genElement('a', { className: 'slide-link' });

    githubSlide.href = getSlideText(idx, github);
    githubSlide.textContent = 'Github';
    githubSlide.target = '_blank';
    githubSlide.rel = 'noopener noreferrer';

    const imgEl = genElement('img', {
      className: `slide-img ${name}`,
      id: `slide-img-${name}-${idx}`,
      src: img,
      alt: alt,
      width: width,
      height: width,
    });

    const slideCenter = genElement('div', { className: 'slide-center wrap-container' }, [
      imgEl,
      titleSlide,
      bioSlide,
      rolesSlide,
      constibutionSlide,
      githubSlide,
    ]);

    const slide = genElement('div', { className: 'swiper-slide swiper-slide-about' }, [slideCenter]);

    wrapper.appendChild(slide);
  });

  slider.appendChild(wrapper);

  if (imagesArray.length > 1) {
    slider.appendChild(genElement('div', { className: 'swiper-pagination' }));
    slider.appendChild(genElement('div', { className: 'swiper-button-next' }));
    slider.appendChild(genElement('div', { className: 'swiper-button-prev' }));
    slider.appendChild(genElement('div', { className: 'swiper-notification' }));
  }

  return slider;
}
