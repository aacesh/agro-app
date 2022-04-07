import { Logger } from "@nestjs/common";
import { UpdateUserDto } from "src/api/users/dtos/update_user.dto";
import { QueryBuilderCreator, QueryTuple } from "src/utils/db/pgsql/querybuilder/qb";

export const t_accounts = {
    queries: {
        'user_by_email': 'select * from users.accounts where email= $1',
        'user_by_id': 'select * from users.accounts where user_id= $1',
        'users': 'select * from users.accounts',
        'delete_user_by_id': 'delete from users.accounts where user_id= $1',
        'admin_login': 'select * from users.accounts where email= $1 and role= $2'
    },
    functions: {
        'add_user': 'select * from users.add_user($1, $2, $3, $4, $5, $6, $7)',
        'update_user': function (dto: UpdateUserDto, role: String): QueryTuple {
            const setValuesDTO = []
            const queryValues = []
            if (dto.firstName) { setValuesDTO.push(`first_name = $${queryValues.length + 1}`); queryValues.push(dto.firstName) }
            if (dto.middleName) { setValuesDTO.push(`middle_name = $${queryValues.length + 1}`); queryValues.push(dto.middleName) }
            if (dto.lastName) { setValuesDTO.push(`last_name = $${queryValues.length + 1}`); queryValues.push(dto.lastName) }
            if (dto.username) { setValuesDTO.push(`username = $${queryValues.length + 1}`); queryValues.push(dto.username) }
            if (dto.password) { setValuesDTO.push(`password = $${queryValues.length + 1}`); queryValues.push(dto.password) }
            if (dto.email) { setValuesDTO.push(`email = $${queryValues.length + 1}`); queryValues.push(dto.email) }
            if (role == 'admin') {
                 if (dto.role) { setValuesDTO.push(`role = $${queryValues.length + 1}`); queryValues.push(dto.role) }
            }
           
            console.log('dto.needs_kyc')
            const query = QueryBuilderCreator
                .update()
                .table('users.accounts')
                .setValues(setValuesDTO)
                .where({ user_id: `$${queryValues.length + 1}` })
                .build()
            queryValues.push(dto.user_id)
            Logger.log('[update user ] query:')
            Logger.log(query);
            return [query, queryValues]
        },
    }
}