import { MIN_AGE } from './validator-сonstants';

export class Validator {
  public static isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
  }

  public static isPassword(value: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    return passwordRegex.test(value);
  }

  public static isName(value: string): boolean {
    const nameRegex = /^[A-Za-z]+$/;

    return nameRegex.test(value);
  }

  public static isDateOfBirth(value: string): boolean {
    const dateBirth = new Date(value);

    if (isNaN(dateBirth.getTime())) {
      return false;
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - dateBirth.getFullYear();
    const month = currentDate.getMonth() - dateBirth.getMonth();
    const isEnoughYears =
      age > MIN_AGE || (age === MIN_AGE && month >= 0 && currentDate.getDate() >= dateBirth.getDate());

    return isEnoughYears;
  }

  public static isStreet(value: string): boolean {
    return value.trim().length > 0;
  }

  public static isCity(value: string): boolean {
    const cityRegex = /^[A-Za-z\s'.-]+$/;

    return cityRegex.test(value);
  }

  public static isPostalCode(value: string, country: string): boolean {
    const regexes: Record<string, RegExp> = {
      Belarus: /^(2[1-4]|3[0-4])\d{3}$/,
      Germany: /^\d{5}$/,
      USA: /^\d{5}(-\d{4})?$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    };

    console.log('country--', regexes[country]);

    return regexes[country]?.test(value) ?? false;
  }
}
