import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from './modules/restaurants/restaurant.module';
import { DishModule } from './modules/dish/dish.module';
import { OrderModule } from './modules/orders/order.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ErrorHandlerMiddleware } from './middleware/error-handler.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Restaurant } from './modules/restaurants/restaurant.entity';
import { Dish } from './modules/dish/dish.entity';
import { Order } from './modules/orders/order.entity';
import { Delivery } from './modules/delivery/delivery.entity';
import { User } from './modules/users/user.entity';
import { KafkaModule } from './kafka/kafka.module';
import { AnalyticsGateway } from './analytics/analytics.gateway';
import { AnalyticsService } from './analytics/analytics.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Restaurant, Dish, Order, Delivery,User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AnalyticsModule,
    KafkaModule,
    RestaurantModule,
    DishModule,
    OrderModule,
    DeliveryModule
    
    
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlerMiddleware).forRoutes('*');
  }
}











