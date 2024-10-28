import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
  slug: string;

  @IsOptional()
  @MaxLength(500, {
    message: 'La descripcion no puede tener mas de 500 caracteres',
  })
  description: string | null;
}
