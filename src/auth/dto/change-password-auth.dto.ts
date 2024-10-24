import { MaxLength, MinLength } from 'class-validator';

export class ChangePasswordAuthDto {
  @MinLength(6, {
    message: 'La contraseña debe tener 6 caracteres como mínimo',
  })
  @MaxLength(30, {
    message: 'La contraseña debe tener 30 caracteres como máximo',
  })
  currentPassword: string;

  @MinLength(6, {
    message: 'La contraseña debe tener 6 caracteres como mínimo',
  })
  @MaxLength(30, {
    message: 'La contraseña debe tener 30 caracteres como máximo',
  })
  newPassword: string;
}
