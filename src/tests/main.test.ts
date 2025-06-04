import { describe, expect, it, vi } from 'vitest';

import { App } from '../app/main';
import { Controller } from '../controllers/controller';

vi.mock('../controllers/controller', () => {
  return {
    Controller: vi.fn(),
  };
});

describe('App', () => {
  it('Create an instance of Controller when initialized', () => {
    new App();
    expect(Controller).toHaveBeenCalled();
  });
});
