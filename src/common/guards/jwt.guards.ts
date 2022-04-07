import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { verifyJwt } from "src/utils/jwt/jwt.service";
import config from "src/utils/config";
import { Request } from "express";




/**
 * Verifies that user has supplied with a password.
 * User must supply the password in the header as basic authentication .e.g 'Basic role:pass'.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('PasswordAuthGuard')
    const request: Request = context.switchToHttp().getRequest()
    // console.log("request:", request.get)
    const accessToken = request.cookies.accessToken
    console.log("access token:", accessToken)
    let payload = verifyJwt(accessToken, config.jwt.accessKey)
    if (payload instanceof Error) {
      console.log(payload.name)
      return false
    }
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('required roles  >>>>>>>>>>>', requiredRoles)
    if (requiredRoles ) {
      const role = payload["role"]
      if (!requiredRoles.includes(role)) {
        console.log("Doesnot contain roles")
        return false
      }
    }
    return true
  }

  matchRoles(roles: string[], userRoles: string[]) {
    return roles.some(role => userRoles.includes(role))
  }

}
