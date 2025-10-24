import { describe, expect, it } from 'vitest';

import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

describe('isCommercetoolsApiError', () => {
  it('should return true for valid CommercetoolsApiError object', () => {
    const error = {
      body: {
        errors: [{ code: 'InvalidInput', message: 'Something went wrong' }],
      },
      statusCode: 400,
    };

    expect(isCommercetoolsApiError(error)).toBe(true);
  });

  it('should return false if value is null', () => {
    expect(isCommercetoolsApiError(null)).toBe(false);
  });

  it('should return false if value is not an object', () => {
    expect(isCommercetoolsApiError('error')).toBe(false);
    expect(isCommercetoolsApiError(123)).toBe(false);
    expect(isCommercetoolsApiError(true)).toBe(false);
  });

  it('should return false if body is missing', () => {
    const error = {
      statusCode: 400,
    };

    expect(isCommercetoolsApiError(error)).toBe(false);
  });

  it('should return false if body is null', () => {
    const error = {
      body: null,
      statusCode: 400,
    };

    expect(isCommercetoolsApiError(error)).toBe(false);
  });

  it('should return false if errors is not an array', () => {
    const error = {
      body: {
        errors: 'not-an-array',
      },
      statusCode: 400,
    };

    expect(isCommercetoolsApiError(error)).toBe(false);
  });

  it('should return false if errors array is empty', () => {
    const error = {
      body: {
        errors: [],
      },
      statusCode: 400,
    };

    expect(isCommercetoolsApiError(error)).toBe(false);
  });

  it('should return false if statusCode is not a number', () => {
    const error = {
      body: {
        errors: [{ code: 'InvalidInput', message: 'Something went wrong' }],
      },
      statusCode: '400',
    };

    expect(isCommercetoolsApiError(error)).toBe(false);
  });
});
