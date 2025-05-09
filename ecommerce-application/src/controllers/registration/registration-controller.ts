// import RegistrationModel from '../../model/registration';
import RegistrationPage from '../../pages/registration';

export class RegistrationController {
  private registrationPage: RegistrationPage;

  constructor() {
    this.registrationPage = new RegistrationPage();
    // this.registrationModel = new RegistrationModel();
    this.render();
  }

  public render(): void {
    document.body.replaceChildren(this.registrationPage.getHtmlElement());
    this.registrationPage.homeButton.getElement().addEventListener('click', (e) => {
      console.log(123, e);
    });
    this.registrationPage.credentialElements.inputEmail.getElement().addEventListener('input', (e) => {
      console.log('input', e);
    });
  }
}
