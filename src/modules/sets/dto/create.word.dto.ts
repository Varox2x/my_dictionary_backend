import { IsString, Length, Validate } from 'class-validator';
import { IsArray } from 'class-validator';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'MaxInputWordLengthExampleSentence',
  async: false,
})
export class MaxInputWordLengthExampleSentence
  implements ValidatorConstraintInterface
{
  validate(input: string[], args: ValidationArguments) {
    if (!Array.isArray(input)) return false;
    const maxLength = 320;
    return input.every((text) => text.length <= maxLength);
  }

  defaultMessage(args: ValidationArguments) {
    return `Total length of ${args.property} must not exceed 320 characters`;
  }
}

@ValidatorConstraint({
  name: 'MaxInputWordLengthNames',
  async: false,
})
export class MaxInputWordLengthNames implements ValidatorConstraintInterface {
  validate(input: string[], args: ValidationArguments) {
    if (!Array.isArray(input)) return false;
    const maxLength = 30;
    return input.every((text) => text.length <= maxLength);
  }

  defaultMessage(args: ValidationArguments) {
    return `Total length of ${args.property} must not exceed 30 characters`;
  }
}
export class CreateWordDto {
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputWordLengthNames)
  names: string[];
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputWordLengthNames)
  definitions: string[];
  @IsArray()
  @IsString({ each: true })
  @Validate(MaxInputWordLengthExampleSentence)
  exampleSentence: string[];
}
