import type { CustomerSignInResult, MyCustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import { getApi, switchToCustomerApi } from './auth';

export async function register(body: MyCustomerDraft): Promise<CustomerSignInResult> {
  const api = getApi();
  const response = await api.me().signup().post({ body }).execute();

  switchToCustomerApi(body);

  return response.body;
}

export async function login(body: MyCustomerSignin): Promise<CustomerSignInResult> {
  const api = getApi();

  const response = await api.me().login().post({ body }).execute();

  switchToCustomerApi(body);

  return response.body;
}
