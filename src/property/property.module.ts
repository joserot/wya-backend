import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Category } from 'src/category/entities/category.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Category])],
  controllers: [PropertyController],
  providers: [PropertyService, CloudinaryService],
})
export class PropertyModule {}
