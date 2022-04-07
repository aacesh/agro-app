import { Module } from "@nestjs/common";
import { DataService } from "src/utils/db/db.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    imports: [
        DataService
    ],
    providers: [
        AdminService
    ],

    controllers: [
        AdminController
    ]
})

export class AdminModule {}
