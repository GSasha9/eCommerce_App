import { anonymousApi } from './anonym';
import { createCustomerApi } from './user';
import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

let currentApi: ByProjectKeyRequestBuilder = anonymousApi;

export function getApi(): ByProjectKeyRequestBuilder {
  return currentApi;
}

export function switchToCustomerApi({ email, password }: { email: string; password: string }): void {
  currentApi = createCustomerApi(email, password);
  localStorage.removeItem('ct_anon_token');
}
