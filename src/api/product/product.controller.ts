import { Body, Controller, Delete, Get, Param, Post, Put, Res, Response, StreamableFile, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { createReadStream, readFileSync } from "fs";
import { join } from "path";
import { Roles } from "src/common/decorators/roles.decorators";
import { JwtAuthGuard } from "src/common/guards/jwt.guards";
import { ResponseModel } from "src/models/response.model";
import { Role } from "../users/enums/roles.enum";
import { CreateProductDto } from "./dtos/create.product.dto";
import { ImageDto } from "./dtos/image.dto";
import { UpdateProductDto } from "./dtos/update.product.dto";
import { ProductService } from "./product.service";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {

    }

    @Post()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async addProduct(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createProductDto: CreateProductDto
    ): Promise<ResponseModel> {
        console.log("product:", createProductDto)
        return this.productService.addProduct(createProductDto)
    }


    @Get()
    @Roles(Role.Admin, Role.User)
    @UseGuards(JwtAuthGuard)
    async getProducts(): Promise<ResponseModel> {
        return this.productService.getProducts()
    }

    @Get("/:id")
    @Roles(Role.Admin, Role.User)
    @UseGuards(JwtAuthGuard)
    async getProduct(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) dto: UpdateProductDto
    ): Promise<ResponseModel> {
        return this.productService.getProduct(dto.id)
    }

    @Put()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async updateProduct(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateProductDto: UpdateProductDto
    ): Promise<ResponseModel> {
        return this.productService.updateProduct(updateProductDto)
    }

    @Delete()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async deleteProduct(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateProductDto: UpdateProductDto
    ): Promise<ResponseModel> {
        return this.productService.deleteProduct(updateProductDto.id)
    }



    @Post('upload-image')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        dest: "./uploads/images"
    }))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File
    ): Promise<ResponseModel> {
        console.log('file;', file)
        let id = file.filename
        let name = file.originalname
        let image: ImageDto = {
            id,
            name
        }
        return this.productService.addImageInfo(image)
    }

    @Get('image/image-info')
    async getImageInfo(
        @Response({passthrough: true}) res
    ) {
        // const file = createReadStream(join(process.cwd(), 'uploads', 'images', '3c0a56eb72761071f1267ae4c3d66e54'));
        // const base64String = readFileSync(join(process.cwd(), 'uploads', 'images', '3c0a56eb72761071f1267ae4c3d66e54'), {encoding: 'base64'});
    
        // const file = createReadStream(join(process.cwd(), 'package.json'));
        const base64String = readFileSync(join(process.cwd(), 'package.json'), {encoding: 'base64'});

        // This will send the exact file
        // res.set({
        //     // 'Content-Type': 'application/json',
        //     // 'Content-Disposition': 'attachment; filename="package.json"',
        //     'Content-Type': 'image/png',
        //   });
        // let stFile= new StreamableFile(file)
        let response= {
            "name": "test",
            "file": base64String
        }
        return base64String
    }


    @Put('update-image')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async updateImageInfo(
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) image: ImageDto
    ): Promise<ResponseModel> {
        return this.productService.updateImageInfo(image)
    }

    @Delete('delete-image/:id')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard)
    async deleteImageInfo(
        @Param('id') id: string
    ): Promise<ResponseModel> {
        return this.productService.deleteImageInfo(id)
    }

}

