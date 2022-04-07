import { Logger } from "@nestjs/common";
import { ImageDto } from "src/api/product/dtos/image.dto";
import { UpdateProductDto } from "src/api/product/dtos/update.product.dto";
import { QueryBuilderCreator, QueryTuple } from "src/utils/db/pgsql/querybuilder/qb";

export const t_products = {
    queries: {
        'product_by_id': 'select * from product.products where id= $1',
        'products': 'select * from product.products',
        'delete_product_by_id': 'delete from product.products where id= $1',
        'get_image_info': 'select * from file.images where id= $1',
        'delete_image_info': 'delete from file.images where id= $1'
    },
    functions: {
        'add_product': 'select * from product.add_product($1, $2, $3)',
        'update_product': function (dto: UpdateProductDto): QueryTuple {
            const setValuesDTO = []
            const queryValues = []
            if (dto.name) { setValuesDTO.push(`name = $${queryValues.length + 1}`); queryValues.push(dto.name) }
            if (dto.description) { setValuesDTO.push(`description = $${queryValues.length + 1}`); queryValues.push(dto.description) }
            if (dto.price) { setValuesDTO.push(`price = $${queryValues.length + 1}`); queryValues.push(dto.price) }
            console.log("set values:", setValuesDTO)
            const query = QueryBuilderCreator
                .update()
                .table('product.products')
                .setValues(setValuesDTO)
                .where({ id: `$${queryValues.length + 1}` })
                .build()
            queryValues.push(dto.id)
            Logger.log('[update product ] query:')
            Logger.log(query);
            return [query, queryValues]
        },
        'add_image_info': 'select * from file.add_image($1, $2)',
        'update_image_info': function (dto: ImageDto): QueryTuple {
            const setValuesDTO = []
            const queryValues = []
            if (dto.name) { setValuesDTO.push(`name = $${queryValues.length + 1}`); queryValues.push(dto.name) }
            console.log("set values:", setValuesDTO)
            const query = QueryBuilderCreator
                .update()
                .table('file.images')
                .setValues(setValuesDTO)
                .where({ id: `$${queryValues.length + 1}` })
                .build()
            queryValues.push(dto.id)
            Logger.log('[update image ] query:')
            Logger.log(query);
            return [query, queryValues]
        },
    }
}