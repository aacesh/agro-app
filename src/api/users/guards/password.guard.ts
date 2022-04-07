
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';



// Not using because we want incorret password message
@Injectable()
export class PasswordGuard implements CanActivate {
  constructor(private userService: UserService ) {}

  canActivate(context: ExecutionContext): any {
    console.log("This is password guard")
    const request = context.switchToHttp().getRequest();
    const {username , password} = request.body
    this.userService.findOne(username)
    .then((user) => {
            if (!user) {
                console.log("User not found")
                return false
            }
            let pw= user.password
            if (password != user.password) {
                return false
            }
            
            console.log("Below")
            return true
    })
  
  }
}
