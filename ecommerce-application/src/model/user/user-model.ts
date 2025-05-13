import { authService } from '../../services/commercetools/auth-service';

export class UserModel {
  public token: string | undefined;
  constructor() {
    this.token = undefined;
  }

  public sendLoginAuthData = async (email: string, password: string): Promise<object | undefined> => {
    this.token = await authService.getAccessToken({ type: 'authenticated', email, password });

    if (!this.token) throw new Error('No token received');

    const response = await authService.signInCustomer(email, password, this.token);

    return response;
  };
}
