import { Module } from "@nestjs/common";
import { DbServiceModule } from "src/utils/db/db-service.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
    imports: [
        DbServiceModule
    ],

    providers: [
        ProductService
    ],

    controllers: [
        ProductController
    ]
})

export class ProductModule{}