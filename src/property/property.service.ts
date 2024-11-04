import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ContactDto } from './dto/contact.dto';
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
    property.latitudeAndLongitude = createPropertyDto.latitudeAndLongitude
      ? createPropertyDto.latitudeAndLongitude
      : null;
    property.location = createPropertyDto.location
      ? createPropertyDto.location
      : null;
    property.totalArea = createPropertyDto.totalArea
      ? Number(createPropertyDto.totalArea)
      : null;
    property.coveredArea = createPropertyDto.coveredArea
      ? Number(createPropertyDto.coveredArea)
      : null;
    property.rooms = createPropertyDto.rooms
      ? Number(createPropertyDto.rooms)
      : null;
    property.bathrooms = createPropertyDto.bathrooms
      ? Number(createPropertyDto.bathrooms)
      : null;
    property.garages = createPropertyDto.garages
      ? Number(createPropertyDto.garages)
      : null;
    property.bedrooms = createPropertyDto.bedrooms
      ? Number(createPropertyDto.bedrooms)
      : null;

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

  async contact(contactDto: ContactDto) {
    const property = await this.propertyRepository.findOne({
      where: {
        id: contactDto.propertyId,
      },
    });

    if (!property) {
      throw new NotFoundException(
        `Property with ID ${contactDto.propertyId} not found`,
      );
    }

    property.contacts = property.contacts ? property.contacts + 1 : 1;

    return this.propertyRepository.save(property);
  }

  async findAll(
    page?: number,
    categorySlug?: string,
    sortBy?: 'minPrice' | 'maxPrice',
  ) {
    const take = 10; // Número de propiedades por página
    const skip = (page - 1) * take;

    const [properties, total] = await this.propertyRepository.findAndCount({
      relations: ['category'],
      where: {
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      order: {
        ...(sortBy === 'minPrice' && { price: 'ASC' }),
        ...(sortBy === 'maxPrice' && { price: 'DESC' }),
      },
      take,
      skip,
    });

    const totalPages = Math.ceil(total / take);

    return {
      properties,
      currentPage: page,
      totalPages,
      totalItems: total,
    };
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
    property.latitudeAndLongitude = updatePropertyDto.latitudeAndLongitude
      ? updatePropertyDto.latitudeAndLongitude
      : null;
    property.location = updatePropertyDto.location
      ? updatePropertyDto.location
      : null;
    property.totalArea = updatePropertyDto.totalArea
      ? Number(updatePropertyDto.totalArea)
      : null;
    property.coveredArea = updatePropertyDto.coveredArea
      ? Number(updatePropertyDto.coveredArea)
      : null;
    property.rooms = updatePropertyDto.rooms
      ? Number(updatePropertyDto.rooms)
      : null;
    property.bathrooms = updatePropertyDto.bathrooms
      ? Number(updatePropertyDto.bathrooms)
      : null;
    property.garages = updatePropertyDto.garages
      ? Number(updatePropertyDto.garages)
      : null;
    property.bedrooms = updatePropertyDto.bedrooms
      ? Number(updatePropertyDto.bedrooms)
      : null;

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
