import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model, ObjectId } from 'mongoose';
import { Product, ProductResponseModel } from './product.model';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    @Inject('PRODUCTS_MQ_SERVICE')
    private readonly rabbitMqService: ClientProxy,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(): Promise<ProductResponseModel> {
    try {
      const result = await this.productModel.find();
      this.rabbitMqService.emit('product-getall', result);
      return {
        message: 'All products are here',
        products: result,
      };
    } catch (error) {
      throw new Error();
    }
  }

  async getProduct(productId: ObjectId): Promise<ProductResponseModel> {
    try {
      const result = await this.productModel.findById(productId);

      if (result) {
        this.rabbitMqService.emit('product.info', result);
        return {
          message: 'Here is your product',
          products: result,
        };
      } else {
        throw new NotFoundException(`There is no product with ${productId}.`);
      }
    } catch (error) {
      throw new Error();
    }
  }

  async insertProduct(
    productTitle: string,
    productDesc: string,
    productPrice: number,
  ): Promise<{ message: string }> {
    try {
      const newProduct = new this.productModel({
        title: productTitle,
        description: productDesc,
        price: productPrice,
      });

      const result = await newProduct.save();
      await this.cacheManager.reset();
      this.rabbitMqService.emit('product-insert', result);
      const message: string = 'Product added successfully.';
      return { message: message };
    } catch (error) {
      throw new Error();
    }
  }

  async updateProduct(
    productId: ObjectId,
    productTitle: string,
    productDesc: string,
    productPrice: number,
  ): Promise<{ message: string }> {
    try {
      const product = await this.productModel.findById(productId);
      const updateFields = {};
      if (productTitle) updateFields['title'] = productTitle;
      if (productDesc) updateFields['description'] = productDesc;
      if (productPrice) updateFields['price'] = productPrice;
      if (product) {
        product.updateOne(updateFields);
        await this.cacheManager.reset();
        return {
          message: 'Your product has been updated.',
        };
      } else {
        throw new NotFoundException(`There is not product with ${productId}.`);
      }
    } catch (error) {
      throw new Error();
    }
  }
}
