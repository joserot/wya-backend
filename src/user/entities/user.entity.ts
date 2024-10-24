import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEmail,
  MaxLength,
  MinLength,
  IsBoolean,
  IsNumber,
  IsString,
} from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
  name: string;

  @Column()
  @IsString()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener mas de 50 caracteres' })
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, {
    message: 'La contraseña no puede tener mas de 50 caracteres',
  })
  password: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;
}
