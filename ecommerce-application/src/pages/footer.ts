import './_footer.scss';
import { CreateElement } from '../shared/utils/create-element.ts';
import { route } from '../router';

export class Footer {
  private readonly footerElement: HTMLElement;

  constructor() {
    this.footerElement = Footer.createFooter();
  }

  private static createFooter(): HTMLElement {
    const footer: CreateElement = new CreateElement({
      tag: 'footer',
      classNames: ['footer', 'wrapper'],
      textContent: '',
      callback: (): void => {},
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
      classNames: ['footer-logo_link'],
      textContent: 'RSSchool',
      callback: (event): void => {
        event.preventDefault();
        route.navigate(`rs.school`);
      },
    });

    logoContainer.addInnerElement(logoImg.getElement());
    logoContainer.addInnerElement(logoLink.getElement());

    footer.addInnerElement(logoContainer.getElement());

    return footer.getElement();
  }

  public getElement(): HTMLElement {
    return this.footerElement;
  }
}
