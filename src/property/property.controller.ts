import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { validateImage } from 'src/utils/image-validation';

@Controller('property')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'images',
        maxCount: 20,
      },
    ]),
  )
  @Post()
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    imagesFiles?: {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    let image: string | null = null;
    const imagesArray: string[] = [];
    const { coverImage, images } = imagesFiles;

    if (coverImage && coverImage[0]) {
      validateImage(coverImage[0]);
      const { secure_url } = await this.cloudinaryService.uploadFile(
        coverImage[0],
      );
      image = secure_url;
    }

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        validateImage(file);
        const { secure_url } = await this.cloudinaryService.uploadFile(file);
        return secure_url;
      });
      imagesArray.push(...(await Promise.all(uploadPromises)));
    }

    return this.propertyService.create(createPropertyDto, image, imagesArray);
  }

  @Post('contact')
  async contact(@Body() contactDto: ContactDto) {
    return this.propertyService.contact(contactDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('sortBy') sortBy?: 'minPrice' | 'maxPrice',
  ) {
    let pageNumber = 1;
    if (page) {
      pageNumber = +page;
    }

    return this.propertyService.findAll(pageNumber, categorySlug, sortBy);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(+id);
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.propertyService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'images',
        maxCount: 20,
      },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles()
    imagesFiles?: {
      coverImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    let image: string | null = null;
    const imagesArray: string[] = [];
    const { coverImage, images } = imagesFiles;

    if (coverImage && coverImage[0]) {
      validateImage(coverImage[0]);
      const { secure_url } = await this.cloudinaryService.uploadFile(
        coverImage[0],
      );
      image = secure_url;
    }

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        validateImage(file);
        const { secure_url } = await this.cloudinaryService.uploadFile(file);
        return secure_url;
      });
      imagesArray.push(...(await Promise.all(uploadPromises)));
    }

    return this.propertyService.update(
      +id,
      updatePropertyDto,
      image,
      imagesArray,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
