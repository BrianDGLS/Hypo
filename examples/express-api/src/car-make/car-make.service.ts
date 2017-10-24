import {readFileSync} from "fs";
import {join} from "path";

const DB = JSON.parse(readFileSync(join(__dirname, "../..", "db.json"), "utf8"));

export class CarMakeService {
  public allMakes() {
    return DB.Makes;
  }

  public getMakeById(id: string) {
    return DB.Makes.find(({make_id}: any) => make_id === id);
  }
}
