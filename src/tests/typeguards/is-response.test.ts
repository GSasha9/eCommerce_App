import { describe, expect, it } from 'vitest';

import { isResponse } from '../../shared/models/typeguards.ts';

describe('isResponse', () => {
  it('should return true for a valid IResponse object', () => {
    const validResponse = {
      access_token: 123456,
      expires_in: '3600',
      token_type: 'Bearer',
      scope: 'read write',
      refresh_token: 'abcdef',
    };

    expect(isResponse(validResponse)).toBe(true);
  });

  it('should return false if access_token is missing', () => {
    const invalidResponse = {
      expires_in: '3600',
      token_type: 'Bearer',
      scope: 'read write',
      refresh_token: 'abcdef',
    };

    expect(isResponse(invalidResponse)).toBe(false);
  });

  it('should return false if access_token is not a number', () => {
    const invalidResponse = {
      access_token: 'not-a-number',
      expires_in: '3600',
      token_type: 'Bearer',
      scope: 'read write',
      refresh_token: 'abcdef',
    };

    expect(isResponse(invalidResponse)).toBe(false);
  });

  it('should return false if expires_in is not a string', () => {
    const invalidResponse = {
      access_token: 123456,
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'read write',
      refresh_token: 'abcdef',
    };

    expect(isResponse(invalidResponse)).toBe(false);
  });

  it('should return false if any required property is missing or of wrong type', () => {
    const invalidResponse = {
      access_token: 123456,
      expires_in: '3600',
      token_type: 'Bearer',
      refresh_token: 'abcdef',
    };

    expect(isResponse(invalidResponse)).toBe(false);
  });

  it('should return false if input is null', () => {
    expect(isResponse(null)).toBe(false);
  });

  it('should return false if input is not an object', () => {
    expect(isResponse(123)).toBe(false);
    expect(isResponse('string')).toBe(false);
    expect(isResponse(true)).toBe(false);
  });
});
