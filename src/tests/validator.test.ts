import { describe, expect, it } from 'vitest';

import { MIN_AGE } from '../shared/constants/messages-for-validator';
import { Validator } from '../shared/utils/validator';

describe('Validator', () => {
  it('email address must be properly formatted (e.g., user@example.com)', () => {
    expect(Validator.isEmail('test@test.com')).toBe(true);
    expect(Validator.isEmail('test-test')).toBe(false);
  });

  it('contains minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 special character(!@#$%^&*) and 1 number, must not contain whitespac', () => {
    expect(Validator.isPassword('Aaaaaa1!')).toBe(true);
    expect(Validator.isPassword('aaaaaaaa')).toBe(false);
    expect(Validator.isPassword('Aaaa1!')).toBe(false);
    expect(Validator.isPassword(' Aaaaaa1! ')).toBe(false);
  });

  it('contains at least one character and does not contain special characters or numbers', () => {
    expect(Validator.isName('Test')).toBe(true);
    expect(Validator.isName('Test-Test')).toBe(false);
    expect(Validator.isName('123')).toBe(false);
  });

  it('must be at least 13 years old', () => {
    const now = new Date();
    const underageDate = new Date(now.getFullYear() - MIN_AGE + 1, now.getMonth(), now.getDate());
    const validDate = new Date(now.getFullYear() - MIN_AGE, now.getMonth(), now.getDate());

    expect(Validator.isDateOfBirth(validDate.toISOString())).toBe(true);
    expect(Validator.isDateOfBirth(underageDate.toISOString())).toBe(false);
    expect(Validator.isDateOfBirth('invalid-date')).toBe(false);
  });

  it('contains at least one character', () => {
    expect(Validator.isStreet('Test St')).toBe(true);
    expect(Validator.isStreet('')).toBe(false);
  });

  it('contains at least one character and does not contain special characters or numbers', () => {
    expect(Validator.isCity('Test Test')).toBe(true);
    expect(Validator.isCity('Test-Test')).toBe(true);
    expect(Validator.isCity('123')).toBe(false);
  });

  it('country selected and the code posted matches the selected country format', () => {
    expect(Validator.isPostalCode('220030', 'BY')).toBe(true);
    expect(Validator.isPostalCode('12345', 'DE')).toBe(true);
    expect(Validator.isPostalCode('12345-6789', 'US')).toBe(true);
    expect(Validator.isPostalCode('SW1A 1AA', 'UK')).toBe(true);

    expect(Validator.isPostalCode('ABCDE', 'US')).toBe(false);
    expect(Validator.isPostalCode('123', 'DE')).toBe(false);
    expect(Validator.isPostalCode('99999', '')).toBe(false);
  });
});
