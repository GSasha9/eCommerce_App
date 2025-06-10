import { expect, it } from 'vitest';

import { isCredentials } from '../../commerce-tools/models/utils/is-credentials';

it('return true if given data has Credentials type', () => {
  const object = {
    email: 'email@mail.ru',
    password: 'Email123123',
  };

  const result = isCredentials(object);

  expect(result).toEqual(true);
});

it('return false if given data has not Credentials type', () => {
  const object = {
    login: 'email@mail.ru',
    password: 'Email123123',
  };

  const result = isCredentials(object);

  expect(result).toEqual(false);
});
