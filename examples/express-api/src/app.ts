import * as express from "express";
import {APP_CONTAINER} from "./containers/app.container";

export const app = express()
  .use("/", APP_CONTAINER.get("CarMakeController"))
  .use(APP_CONTAINER.get("404Handler"))
  .use(APP_CONTAINER.get("ErrorHandler"));

app.listen(3000, () => {
  console.log("running on port 3000");
});
