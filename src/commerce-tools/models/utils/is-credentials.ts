import type { Credentials } from '../types';

export function isCredentials(obj: unknown): obj is Credentials {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'email' in obj &&
    'password' in obj &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string'
  );
}
