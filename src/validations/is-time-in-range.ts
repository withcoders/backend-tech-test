import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

const startHour = parseInt(process.env.START_HOUR || '19', 10);
const endHour = parseInt(process.env.END_HOUR || '24', 10);
const setDurationInHour = parseInt(process.env.SEAT_DURATION || '1', 10);
@ValidatorConstraint({ async: false })
export class IsTimeInRangeConstraint implements ValidatorConstraintInterface {
  validate(dateTimeStr: string, args: ValidationArguments) {
    const dateTime = new Date(dateTimeStr);
    const hours = dateTime.getUTCHours();
    const minutes = dateTime.getUTCMinutes();
    return (hours >= startHour && hours <= endHour - setDurationInHour) // last time slot should end before endHour
      && (minutes >= 0 && minutes < 60);
  }
  
  defaultMessage(args: ValidationArguments) {
    return `Time must be between ${startHour}:00 and ${endHour}:00`;
  }
}

export function IsTimeInRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeInRangeConstraint,
    });
  };
}