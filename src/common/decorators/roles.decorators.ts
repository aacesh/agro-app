
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/api/users/enums/roles.enum';


export const ROLES_KEY= 'roles'
export const Roles = (...roles: string[]) => {
    console.log("Roles to assign:", roles)
    return SetMetadata('roles', roles)
};

