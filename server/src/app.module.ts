import { Global, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ProductsModule } from './products/products.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config({ path: './.env' });

@Global()
@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
      }),
      isGlobal: true,
    }),
    ClientsModule.register({
      isGlobal: true,

      clients: [
        {
          name: 'PRODUCTS_MQ_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'products-queue',
          },
        },
      ],
    }),
  ],
  controllers: [],
  providers: [ProductsModule],
  exports: [],
})
export class AppModule {}
