import {Global, Module} from "@nestjs/common";
// import config from "../config";
import { DataService } from "./db.service";

@Global()
@Module({
  providers: [
    { 
      provide: "DATAMODULE", 
      useValue: new DataService({ 
        "postgres": "pg"
      })
    }
  ],
  exports: ["DATAMODULE"]
})
export class DbServiceModule {}
