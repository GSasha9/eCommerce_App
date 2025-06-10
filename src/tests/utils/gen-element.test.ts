import { describe, expect, it } from 'vitest';

import { genElement } from '../../shared/utils/gen-element';

describe('genElement', () => {
  it('should create a div element with no attributes or children', () => {
    const el = genElement('div');

    expect(el.tagName).toBe('DIV');
    expect(el.hasAttributes()).toBe(false);
    expect(el.childNodes.length).toBe(0);
  });

  it('should apply given attributes and dataset', () => {
    const el = genElement('button', {
      id: 'myBtn',
      className: 'primary',
      dataset: {
        action: 'submit',
        custom: '123',
      },
    });

    expect(el.id).toBe('myBtn');
    expect(el.className).toBe('primary');
    expect(el.dataset.action).toBe('submit');
    expect(el.dataset.custom).toBe('123');
  });

  it('should append children elements and text nodes', () => {
    const span = document.createElement('span');

    span.textContent = 'inside';

    const el = genElement('div', {}, ['Text before', span, 'Text after']);

    expect(el.childNodes.length).toBe(3);
    expect(el.textContent).toBe('Text beforeinsideText after');
    expect(el.children[0]).toBe(span);
  });

  it('should correctly return element with specified type', () => {
    const input = genElement('input', { type: 'text', value: 'Hello' });

    expect(input.tagName).toBe('INPUT');
    expect(input.value).toBe('Hello');

    const form = genElement('form');

    expect(form.tagName).toBe('FORM');
  });
});
