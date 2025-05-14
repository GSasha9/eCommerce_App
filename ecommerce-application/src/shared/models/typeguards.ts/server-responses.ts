import type { ClientResponse } from '@commercetools/ts-client';
import type { CustomerPagedQueryResponse } from '@commercetools/platform-sdk';

export const findUserByEmailResponse = (response: unknown): response is ClientResponse<CustomerPagedQueryResponse> => {
  if (typeof response !== 'object' || response === null || !('body' in response)) {
    return false;
  }

  const body = response.body;

  if (
    typeof body !== 'object' ||
    body === null ||
    !('count' in body) ||
    typeof body.count !== 'number' ||
    !('total' in body) ||
    typeof body.total !== 'number' ||
    !('results' in body) ||
    !Array.isArray(body.results)
  ) {
    return false;
  }

  if (body.results.length > 0) {
    return isCustomerInfo(body.results[0]);
  }

  return true;
};

const isCustomerInfo = (item: unknown): item is { id: string; email: string } => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof item.id === 'string' &&
    'email' in item &&
    typeof item.email === 'string'
  );
};
