import { describe, it, expect } from 'vitest';
import { setTitle } from '../index';

describe('setTitle', () => {
  it('sets document title', () => {
    setTitle('Hello World');
    expect(document.title).toBe('Hello World');
  });
});
