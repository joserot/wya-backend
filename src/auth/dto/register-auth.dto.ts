import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @MinLength(3, {
    message: 'El nombre debe tener 3 caracteres como mínimo',
  })
  @MaxLength(30, {
    message: 'El nombre debe tener 30 caracteres como máximo',
  })
  name: string;

  @MinLength(3, {
    message: 'El apellido debe tener 3 caracteres como mínimo',
  })
  @MaxLength(30, {
    message: 'El apellido debe tener 30 caracteres como máximo',
  })
  lastName: string;

  @MinLength(6, {
    message: 'La contraseña debe tener 6 caracteres como mínimo',
  })
  @MaxLength(30, {
    message: 'La contraseña debe tener 30 caracteres como máximo',
  })
  password: string;
}
