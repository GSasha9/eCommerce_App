import { beforeEach, describe, expect, it } from 'vitest';

import { CreateInput } from '../components/input/create-input';
import type { IParametersInput } from '../shared/models/interfaces';

describe('CreateInput', () => {
  let baseParams: IParametersInput;

  beforeEach(() => {
    baseParams = {
      type: 'text',
      placeholder: 'Enter name',
      classNames: ['custom-input'],
    };
  });

  it('should create input element with default type and placeholder', () => {
    const input = new CreateInput(baseParams);
    const el = input.getElement();

    expect(el).toBeInstanceOf(HTMLInputElement);
    expect(input.getPlaceholder()).toBe('Enter name');
    expect(el.classList.contains('root-input')).toBe(true);
    expect(el.classList.contains('custom-input')).toBe(true);
  });

  it('should correctly get and set value', () => {
    const input = new CreateInput(baseParams);

    input.setValue('test');
    expect(input.getValue()).toBe('test');

    input.setValue(undefined);
    expect(input.getValue()).toBe('');
  });

  it('should get and set placeholder correctly', () => {
    const input = new CreateInput(baseParams);

    input.setPlaceholder('New placeholder');
    expect(input.getPlaceholder()).toBe('New placeholder');
  });

  it('should apply optional parameters: value, id, name, autocomplete', () => {
    const params: IParametersInput = {
      ...baseParams,
      value: 'hello',
      id: 'my-id',
      name: 'username',
    };

    const input = new CreateInput(params);
    const el = input.getElement();

    expect(input.getValue()).toBe('hello');
    expect(el.id).toBe('my-id');
  });
});
