import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_RULE : RegExp= /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const PASSWORD_RULE_MESSAGE : string=
  'Password should have 1 upper case, lowcase letter along with a number and special character.';
const float_rule: RegExp= /^\d*\.\d*$/
const float_rule_message: string= "Price should be postive float number"

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const passwordRegex = {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
};

export const floatRegex= {
    float_rule,
    float_rule_message
}

export const SETTINGS = {
  VALIDATION_PIPE,
};