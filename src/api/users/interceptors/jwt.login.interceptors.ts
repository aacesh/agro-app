import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { generateJwt } from 'src/utils/jwt/jwt.service';
import { LoginUser } from '../dtos/login.user.dto';

@Injectable()
export class JwtLoginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    let request= context.switchToHttp().getRequest()
    let response: Response= context.switchToHttp().getResponse()
    let user: LoginUser=  request.body
    console.log("Login user in jwt interceptor:", user)
    const now = Date.now();
    return next
      .handle()
      .pipe(
        map((value) =>  {
            // console.log("value:",value)
            // console.log("user:", request.user)
            let payload = {
                email: request.user.email,
                role: request.user.role
            }
            let tokens= generateJwt(payload)
            // let tokens= JwtService.generateTokens(payload)
            console.log("tokens:", tokens)
            response.cookie("accessToken", tokens['accessToken'])
            response.cookie("refreshToken", tokens['refreshToken'])
            // response.json({"test": "test"})
            return value
        }),
      );
  }
}


