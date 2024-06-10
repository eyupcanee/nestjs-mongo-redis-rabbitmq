import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CacheTTL, CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ProductService } from './products.service';
import { ProductResponseModel } from './product.model';
import { ObjectId } from 'mongoose';

@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  @CacheTTL(60 * 1000)
  @CacheKey('products')
  async getAllProducts(): Promise<ProductResponseModel> {
    try {
      const result = await this.productService.getAllProducts();
      return result;
    } catch (error) {
      throw new Error();
    }
  }

  @Get(':id')
  @CacheTTL(60 * 1000)
  async getProduct(@Param('id') productId: ObjectId) {
    const result = await this.productService.getProduct(productId);
    return result;
  }

  @Post('/add')
  async insertProduct(
    @Body('title') productTitle: string,
    @Body('description') productDesc: string,
    @Body('price') productPrice: number,
  ): Promise<{ message: string }> {
    const result = await this.productService.insertProduct(
      productTitle,
      productDesc,
      productPrice,
    );
    return result;
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id') productId: ObjectId,
    @Body('title') productTitle: string,
    @Body('description') productDesc: string,
    @Body('price') productPrice: number,
  ): Promise<{ message: string }> {
    try {
      const result = await this.productService.updateProduct(
        productId,
        productTitle,
        productDesc,
        productPrice,
      );
      return result;
    } catch (error) {
      throw new Error();
    }
  }
}
