import * as express from "express";

import { AppModule } from "./app.module";
import { CarMakeModule } from "./car-make";

const app = express()
  .use(CarMakeModule.get("CarMakeController"))
  .use(AppModule.get("404Handler"))
  .use(AppModule.get("ErrorHandler"))
  .listen(3000, () => {
    console.log("running on port 3000");
  });
