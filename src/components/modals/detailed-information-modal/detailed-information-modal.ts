import { authService } from '../../../commerce-tools/auth-service';
import Element from '../../element';
import { Modal } from '../modal';

import '../styles.scss';
import './styles.scss';

export class detailedInformationModal extends Modal {
  private content: Element<'div'>;
  private button: Element<'button'>;
  private image: Element<'img'>;
  private id: string;

  constructor(id: string) {
    super();
    this.id = id;

    this.button = new Element<'button'>({
      tag: 'button',
      className: 'button-close',
      textContent: 'Ok',
    });
    this.image = new Element<'img'>({
      tag: 'img',
      className: 'img-modal',
      alt: '',
      src: '',
      width: 200,
      height: 200,
    });
    this.content = new Element<'div'>({
      tag: 'div',
      className: 'content info',
      textContent: 'что то там ',
    });
    this.modal.node.prepend(this.image.node, this.content.node, this.button.node);
    this.button.node.addEventListener('click', this.close);

    void this.getProductInformation(this.id);
  }

  public fillElements(alt: string, src: string): void {
    Object.assign(this.image.node, { alt, src });
  }

  public async getProductInformation(id: string): Promise<void> {
    const response = await authService.getProductByKey(id);
    const alt = response.body.name.en;
    const src = response.body.masterVariant.images?.[0].url;

    if (src) {
      this.fillElements(alt, src);
    }
  }
}
