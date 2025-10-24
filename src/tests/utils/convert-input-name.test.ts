import { describe, expect, it } from 'vitest';

import { convertInputName } from '../../shared/utils/convert-input-name';

describe('convertInputName', () => {
  it('converts single-word input', () => {
    expect(convertInputName('username')).toBe('username');
  });

  it('converts kebab-case to camelCase', () => {
    expect(convertInputName('first-name')).toBe('firstName');
    expect(convertInputName('user-profile-image')).toBe('userProfileImage');
    expect(convertInputName('x-y-z')).toBe('xYZ');
  });

  it('returns empty string if input is empty', () => {
    expect(convertInputName('')).toBe('');
  });

  it('handles input with multiple consecutive dashes', () => {
    expect(convertInputName('user--name')).toBe('userName');
  });

  it('handles input starting or ending with dash', () => {
    expect(convertInputName('-username')).toBe('Username');
    expect(convertInputName('username-')).toBe('username');
  });
});
