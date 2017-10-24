import {NextFunction, Request, Response} from "express";
import {Container} from "../../../../lib/express";
import {CarMakeController} from "../car-make/car-make.controller";

export const APP_CONTAINER = new Container()
  .controller("CarMakeController", CarMakeController)
  .register("404Handler", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Not Found");
    const status = 404;
    next({status, message: err.message});
  })
  .register("ErrorHandler", (err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send(err);
  });
