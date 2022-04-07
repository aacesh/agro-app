
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log("This is user registration validation")
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    let errorList: string[] = []
    if (errors.length > 0) {
      errorList = [...this.getErrors(errors[0])]
    }
    if (value.password != value.confirmPassword) errorList.push('Password and confirm password must be same')
    if (errorList.length>0) {
      throw new BadRequestException(errorList);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getErrors(error: Object): string[] {
    let errorObject: object = error['constraints']
    let errors: string[] = []
    for (const key in errorObject) {
      if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
        const element = errorObject[key];
        errors.push(element)

      }
    }
    return errors
  }
}
