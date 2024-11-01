import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    coverImage: string | null,
    images: string[],
  ) {
    const property = new Property();
    property.name = createPropertyDto.name;
    property.slug = createPropertyDto.slug;
    property.description = createPropertyDto.description;
    property.price = Number(createPropertyDto.price);
    property.coverImage = coverImage ? coverImage : null;
    property.images = images;

    const category = await this.categoryRepository.findOne({
      where: {
        id: Number(createPropertyDto.categoryId),
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createPropertyDto.categoryId} not found`,
      );
    }
    property.category = category;

    await this.propertyRepository.save(property);

    return property;
  }

  async findAll() {
    const properties = await this.propertyRepository.find({
      relations: ['category'],
    });
    return properties;
  }

  async findOne(id: number) {
    const property = await this.propertyRepository.findOne({
      relations: ['category'],
      where: {
        id,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findOneBySlug(slug: string) {
    const property = await this.propertyRepository.findOne({
      relations: ['category'],
      where: {
        slug,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with slug ${slug} not found`);
    }

    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
    coverImage: string | null,
    images: string[],
  ) {
    const property = await this.propertyRepository.findOne({
      where: {
        id,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    property.name = updatePropertyDto.name;
    property.slug = updatePropertyDto.slug;
    property.description = updatePropertyDto.description;
    property.price = Number(updatePropertyDto.price);
    property.coverImage = coverImage ? coverImage : null;
    property.images = images;

    const category = await this.categoryRepository.findOne({
      where: {
        id: Number(updatePropertyDto.categoryId),
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${updatePropertyDto.categoryId} not found`,
      );
    }
    property.category = category;

    return this.propertyRepository.save(property);
  }

  async remove(id: number) {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new HttpException(
        'No se encontro la propiedad',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.propertyRepository.remove(property);

    return property;
  }
}
