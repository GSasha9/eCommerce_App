import { describe, it, expect, beforeEach } from 'vitest';

import { hello } from '../index';

describe('hello', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('adds a div with the text Hello! to the body', () => {
    hello();

    const div = document.body.querySelector('div');

    expect(div).not.toBeNull();
    expect(div?.textContent).toBe('Hello!');
  });
});
