export type AuthState = { type: 'anonymous' } | { type: 'authenticated'; email: string; password: string };
