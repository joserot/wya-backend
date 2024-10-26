import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsNumber,
  MaxLength,
  MinLength,
  IsString,
  IsArray,
} from 'class-validator';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
  name: string;

  @Column({ unique: true })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracteres' })
  slug: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(500, {
    message: 'La descripcion no puede tener mas de 500 caracteres',
  })
  description: string | null;

  @Column({ nullable: true })
  @IsNumber()
  price: number | null;

  @Column({ nullable: true })
  @IsString()
  coverImage: string | null;

  @Column({ nullable: true })
  @IsArray()
  images: string[] | null;
}
