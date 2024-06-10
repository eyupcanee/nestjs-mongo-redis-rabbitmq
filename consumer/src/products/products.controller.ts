import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductService } from './products.service';
import { Product } from './product.model';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @EventPattern('product-insert')
  handleProductInsert(@Payload() product: Product) {
    this.productService.handleProductInserted(product);
  }

  @EventPattern('product-getall')
  handleProductGetAll(@Payload() product: Product | Product[]) {
    this.productService.handleProductGet(product);
  }
}
