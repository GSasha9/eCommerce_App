import { expect, it } from 'vitest';

import { findKeyByValue } from '../../controllers/catalog/utils/find-key-by-value';

it('find the matching value in the map for the given value', () => {
  const map: Map<string, string> = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
    ['key3', 'value3'],
    ['key4', 'value4'],
  ]);
  const value: string = 'value3';

  const result = findKeyByValue(map, value);

  expect(result).toEqual('key3');
});

it('returns undefind if value not find', () => {
  const map: Map<string, string> = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ]);

  const result = findKeyByValue(map, 'valueX');

  expect(result).toBeUndefined();
});
