import { MaxLength, MinLength, IsString, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsString()
  categoryId: string;
}
