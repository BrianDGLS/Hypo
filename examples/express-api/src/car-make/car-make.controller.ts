import { NextFunction, Request, Response } from "express";
import { Inject } from "../../../../lib/core";
import { Controller, Get } from "../../../../lib/express";

import { SERVICE_CONTAINER } from "../containers/service.container";
import { CarMakeService } from "./car-make.service";

@Inject([CarMakeService])
export class CarMakeController extends Controller {
  private CarMakeService: CarMakeService;

  @Get("/")
  public index(req: Request, res: Response, next: NextFunction) {
    res.send(this.CarMakeService.allMakes());
  }

  @Get("/:id")
  public show(req: Request, res: Response, next: NextFunction) {
    const make = this.CarMakeService.getMakeById(req.params.id);
    make ? res.send(make) : next();
  }
}
