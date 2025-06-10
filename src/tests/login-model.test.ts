import { beforeEach, describe, expect, it } from 'vitest';

import { LoginController } from '../controllers/login/login-controller';
import { LoginModel } from '../model/login/login-model';
import { LoginPage } from '../pages/login/login';

describe('LoginModel', () => {
  const fakePage = LoginPage.getInstance({}, new LoginController());
  let model: LoginModel;

  beforeEach(() => {
    model = LoginModel.getInstance(fakePage);
  });

  it('should initialize with empty email and password', () => {
    expect(model.currentFormValues).toEqual({
      email: '',
      password: '',
    });
  });

  it('should set string values correctly if input name is valid', () => {
    model.setStringValue('test@email.com', 'email');
    model.setStringValue('Password123', 'password');

    expect(model.currentFormValues.email).toBe('test@email.com');
    expect(model.currentFormValues.password).toBe('Password123');
  });

  it('should set boolean values correctly if input name is valid', () => {
    model.setBooleanValue(true, 'isDefaultBilling');
    expect(model.currentFormValues.isDefaultBilling).toBe(true);
  });

  it('should validate form with correct email and password', () => {
    model.setStringValue('user@mail.com', 'email');
    model.setStringValue('ValidPass!1', 'password');

    const result = model.validateForm();

    expect(result.errors).toEqual([]);
    expect(result.isValidForm).toBe(true);
  });

  it('should return errors when email and password are invalid', () => {
    model.setStringValue('bademail', 'email');
    model.setStringValue('123', 'password');

    const result = model.validateForm();

    expect(result.errors).toEqual(['email', 'password']);
    expect(result.isValidForm).toBe(false);
  });

  it('should mark form invalid if required fields are empty', () => {
    const result = model.validateForm();

    expect(result.isValidForm).toBe(false);
  });
});
