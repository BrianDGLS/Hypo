import {Router} from "express";

export interface IController {
  getRouter(): Router;
}

export interface IControllerConstructor {
  new (): IController;
}

export class Controller implements IController {
  private router: Router;

  public getRouter(): Router {
    if (!this.router) {
      this.router = Router();
    }
    return this.router;
  }
}
