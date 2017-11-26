import { Container } from "../../../../lib/express";
import { CarMakeController } from "../car-make/car-make.controller";

export const CarMakeModule = new Container().controller(
  "CarMakeController",
  CarMakeController
);
