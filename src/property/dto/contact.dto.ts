import { IsString } from 'class-validator';

export class ContactDto {
  @IsString()
  propertyId: string;
}
