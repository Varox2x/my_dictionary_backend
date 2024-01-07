import { IsString, Length, Validate } from 'class-validator';
import { IsArray } from 'class-validator';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxInputWordLength', async: false })
export class MaxInputLengthValidator implements ValidatorConstraintInterface {
  validate(input: string[], args: ValidationArguments) {
    if (!Array.isArray(input)) return false;
    const maxLength = 60;
    const totalLength = input.reduce((sum, input) => sum + input.length, 0);
    return totalLength <= maxLength;
  }

  defaultMessage(args: ValidationArguments) {
    return `Total length of ${args.property} must not exceed 20 characters`;
  }
}
export class CreateWordDto {
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputLengthValidator)
  names: string[];
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputLengthValidator)
  definitions: string[];
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputLengthValidator)
  exampleSentence: string[];
}
