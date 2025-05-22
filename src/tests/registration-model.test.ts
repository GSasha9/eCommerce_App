import { describe, it, expect, beforeEach } from 'vitest';
import RegistrationModel from '../model/registration/registration-model.ts';
import RegistrationPage from '../pages/registration/registration-page.ts';
import { isFormName } from '../shared/models/typeguards.ts/typeguards.ts';

const mockPage = RegistrationPage.getInstance();

describe('RegistrationModel', () => {
  let model: RegistrationModel;

  beforeEach(() => {
    model = RegistrationModel.getInstance(mockPage);
  });

  describe('setStringValue', () => {
    it('should set valid string field', () => {
      model.setStringValue('test@example.com', 'email');
      expect(model.currentFormValues.email).toBe('test@example.com');
    });

    it('should not set a boolean field', () => {
      const prevValue = model.currentFormValues['isDefaultBilling'];

      model.setStringValue('true', 'isDefaultBilling');
      expect(model.currentFormValues['isDefaultBilling']).toBe(prevValue);
    });
  });

  describe('determineValidForm', () => {
    it('should be false if any field is empty', () => {
      model.determineValidForm();
      expect(model.isValidForm).toBe(false);
    });

    it('should be true if all fields are filled and no errors', () => {
      for (const key in model.currentFormValues) {
        if (!isFormName(key)) return;

        if (typeof model.currentFormValues[key] === 'boolean') {
          model.setBooleanValue(true, key);
        } else {
          model.setStringValue('value', key);
        }
      }

      model.errors = [];
      model.determineValidForm();
      expect(model.isValidForm).toBe(true);
    });
  });
});
