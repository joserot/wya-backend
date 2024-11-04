import { IsNumber } from 'class-validator';

export class ContactDto {
  @IsNumber()
  propertyId: number;
}
