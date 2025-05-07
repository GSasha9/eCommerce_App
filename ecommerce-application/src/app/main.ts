import { Controller } from '../controllers/controller.ts';

export class App {
  private controller: Controller;

  constructor() {
    this.controller = new Controller();
  }
}
