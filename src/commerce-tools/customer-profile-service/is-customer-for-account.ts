import type { Customer } from '@commercetools/platform-sdk';

export function isCustomerRes(obj: unknown): obj is Customer {
  if (typeof obj !== 'object' || obj === null) return false;

  if (!('id' in obj) || typeof obj?.id !== 'string') return false;

  if (!('version' in obj) || typeof obj.version !== 'number') return false;

  if (!('createdAt' in obj) || typeof obj.createdAt !== 'string') return false;

  if ('lastModifiedAt' in obj && typeof obj.lastModifiedAt !== 'string') return false;

  if ('dateOfBirth' in obj && typeof obj.dateOfBirth !== 'string') return false;

  if ('password' in obj && typeof obj.password !== 'string') return false;

  if ('email' in obj && typeof obj.email !== 'string') return false;

  if ('addresses' in obj) {
    if (!Array.isArray(obj.addresses)) return false;
  }

  return true;
}
