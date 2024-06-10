import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './products.service';
import { ProductSchema } from './product.model';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
