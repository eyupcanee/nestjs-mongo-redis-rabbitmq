import { Injectable } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  handleProductInserted(product: Product): string {
    console.log(`${product._id} inserted. Product Name : ${product.title}`);
    return `${product._id} inserted. Product Name : ${product.title}`;
  }

  handleProductGet(product: Product | Product[]) {
    if (Array.isArray(product)) {
      product.forEach((item) => {
        console.log(`Products : ${item.title}`);
      });
    } else {
      console.log(`Products : ${product.title}`);
    }
  }
}
