import { Container } from "../../../../lib/express";
import { CarMakeController } from "../car-make/car-make.controller";
import { CarMakeService } from "../car-make/car-make.service";

export const CarMakeModule = new Container()
  .service("CarMakeService", CarMakeService)
  .controller("CarMakeController", CarMakeController);
