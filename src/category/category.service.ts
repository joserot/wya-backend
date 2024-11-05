import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();

    const existSlug = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existSlug) {
      throw new HttpException(
        'Ya existe una categoría con ese slug',
        HttpStatus.BAD_REQUEST,
      );
    }

    category.name = createCategoryDto.name;
    category.slug = createCategoryDto.slug;
    category.description = createCategoryDto.description;

    this.categoryRepository.save(category);

    return category;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new HttpException(
        'No se encontro la categoría',
        HttpStatus.NOT_FOUND,
      );
    }

    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new HttpException(
        'No se encontro la categoría',
        HttpStatus.NOT_FOUND,
      );
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new HttpException(
        'No se encontro la categoría',
        HttpStatus.NOT_FOUND,
      );
    }

    category.name = updateCategoryDto.name;
    category.slug = updateCategoryDto.slug;
    category.description = updateCategoryDto.description;

    this.categoryRepository.save(category);

    return category;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new HttpException(
        'No se encontro la categoría',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.categoryRepository.remove(category);

    return category;
  }
}
