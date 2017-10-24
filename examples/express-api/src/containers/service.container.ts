import {Container} from "../../../../lib/express";
import {CarMakeService} from "../car-make/car-make.service";

export const SERVICE_CONTAINER = new Container()
  .service("CarMakeService", CarMakeService);
