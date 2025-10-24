import { CreateElement } from '../../shared/utils/create-element.ts';

import './footer.scss';

export class Footer {
  private readonly footerElement: HTMLElement;

  constructor() {
    this.footerElement = Footer.createFooter();
  }

  private static createFooter(): HTMLElement {
    const footer: CreateElement = new CreateElement({
      tag: 'footer',
      classNames: ['footer'],
      textContent: '',
      callback: (): void => {},
    });
    const footerWrapper: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['wrapper', 'wrapper-footer'],
    });

    const logoContainer: CreateElement = new CreateElement({
      tag: 'div',
      classNames: ['footer-logo__container'],
      textContent: '',
      callback: (): void => {},
    });

    const logoImg: CreateElement = new CreateElement({
      tag: 'img',
      classNames: ['footer-logo__img'],
      textContent: '',
      callback: (): void => {},
    });

    const logoLink: CreateElement = new CreateElement({
      tag: 'a',
      classNames: ['footer-logo__link'],
      textContent: 'RSSchool',
      callback: (event): void => {
        event.preventDefault();
        window.location.href = 'https://rs.school';
      },
    });

    logoContainer.addInnerElement(logoImg.getElement());
    logoContainer.addInnerElement(logoLink.getElement());

    footer.addInnerElement(footerWrapper.getElement());
    footerWrapper.addInnerElement(logoContainer.getElement());

    return footer.getElement();
  }

  public getElement(): HTMLElement {
    return this.footerElement;
  }
}
