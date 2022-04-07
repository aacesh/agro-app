import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { t_products } from "src/db_helper/t_products";
import { ProductModel } from "src/models/product.model";
import { DataService } from "src/utils/db/db.service";
import { ResponseModel } from "src/models/response.model"
import { UpdateProductDto } from "./dtos/update.product.dto";
import { ImageDto } from "./dtos/image.dto";
import { unlinkSync } from "fs";
import {join} from "path";

@Injectable()
export class ProductService {
    constructor(@Inject('DATAMODULE') private readonly dataService: DataService) {

    }

    async addProduct(product: ProductModel): Promise<ResponseModel> {
        try {
            console.log("ADD product service")
            const pgClient = this.dataService.pgClient
            let result = await pgClient.query(t_products.functions.add_product, [product.name, product.description, product.price])
            console.log(result.rows)
            product.id = result.rows[0]["_id"]
            let response: ResponseModel = {
                error: false,
                messages: `${product.name} added`,
                statuscode: 201,
                timestamp: new Date().toISOString(),
                data: {
                    product
                }
            }
            return response
        } catch (error) {
            console.log("error:", error)
            throw error
        }

    }

    async getProducts(): Promise<ResponseModel> {
        console.log("GET all products service")
        const pgClient = this.dataService.pgClient
        let result = await pgClient.query(t_products.queries.products)
        let products = result.rows
        let response: ResponseModel = {
            error: false,
            messages: "All products",
            statuscode: 200,
            timestamp: new Date().toISOString(),
            data: {
                products
            }
        }
        return response
    }


    async getProduct(id: number): Promise<ResponseModel> {
        try {
            console.log("Get a product service")
            const pgClient = this.dataService.pgClient
            let result = await pgClient.query(t_products.queries.product_by_id, [id])
            if (result.rowCount < 1) {
                throw new NotFoundException(`Product with id ${id} not found`)      
            }
            let product= result.rows[0]
            let res: ResponseModel= {
                error: false,
                messages: `Product found`,
                statuscode: 200,
                data: {
                    product
                }
            }
            return res        
        } catch (error) {
            throw error
        }


    }

    async updateProduct(updateProductDto: UpdateProductDto): Promise<any> {
        try {
            console.log("Update product service")
            const pgClient = this.dataService.pgClient
            let result = await pgClient.query(t_products.queries.product_by_id, [updateProductDto.id])
            if (result.rowCount < 1) {
                throw new NotFoundException(`Product with id ${updateProductDto.id} not found. Couldn't update`)      
            }
            await pgClient.query(...t_products.functions.update_product(updateProductDto))
            let res: ResponseModel = {
                error: false,
                messages: ` Product with id ${updateProductDto.id} updated successfully`,
                statuscode: 200,
                data: {
                    updatedProduct: updateProductDto
                }
            }
            return res
        } catch (error) {
            throw error
        }
    }


    async deleteProduct(id: number): Promise<ResponseModel> {
        try {
            let pgClient= this.dataService.pgClient
            let result= await pgClient.query(t_products.queries.product_by_id, [id])
            if (result.rowCount < 1) {
                throw new NotFoundException(`Product with id ${id} not found. Couldn't delete`)
            }
            await pgClient.query(t_products.queries.delete_product_by_id, [id])
            let res: ResponseModel= {
                error: false,
                messages: `Product with id ${id} deleted succesfully`,
                statuscode: 200
            }
            return res
        } catch (error) {
            throw error
        }
    }


    async addImageInfo(image: ImageDto) : Promise<ResponseModel> {
        try {
            let pgClient= this.dataService.pgClient
            await pgClient.query(t_products.functions.add_image_info, [image.id, image.name])
            let res: ResponseModel= {
                error: false,
                messages: `Image ${image.name} added successfully`,
                statuscode: 201,
                data: {
                    image
                }
            }
            return res
        } catch (error) {
            throw error
        }
    }

    async updateImageInfo(image: ImageDto) : Promise<ResponseModel> {
        try {
            console.log("Update image info")
            let pgClient= this.dataService.pgClient
            let result= await pgClient.query(t_products.queries.get_image_info, [image.id])
            console.log("[151]")
            if (result.rowCount < 1) {
                throw new NotFoundException(`Image with id ${image.id} doesn't found. Couldn't update`)
            }
            await pgClient.query(...t_products.functions.update_image_info(image))
            let res: ResponseModel= {
                error: false,
                messages: `Image with id ${image.id} updated succesfully`,
                statuscode: 200,
                data: {
                    image
                }
            }
            return res
        } catch (error) {
            throw error
        }
    }


    async deleteImageInfo(id: string) : Promise<ResponseModel> {
        try {
            let pgClient= this.dataService.pgClient
            console.log("pwd:", process.cwd())
            let filePtah= join(process.cwd(), "uploads", "images", id)
            console.log(filePtah)
            await unlinkSync(filePtah)
            let result= await pgClient.query(t_products.queries.get_image_info, [id])
            if (result.rowCount < 1) {
                throw new NotFoundException(`Image with id ${id} doesn't found. Couldn't delete`)
            }
            await pgClient.query(t_products.queries.delete_image_info, [id])
            let res: ResponseModel= {
                error: false,
                messages: `Image with id ${id} deleted succesfully`,
                statuscode: 200
            }
            return res
        } catch (error) {
            throw error
        }
    }
}

