import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsGateway } from './analytics.gateway';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { OrderModule } from '../modules/orders/order.module';
import { DeliveryModule } from '../modules/delivery/delivery.module';
import { KafkaModule } from '../kafka/kafka.module';
import { Order } from '../modules/orders/order.entity';
import { Dish } from '../modules/dish/dish.entity';
import { Delivery } from '../modules/delivery/delivery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Dish, Delivery]),
    OrderModule,
    DeliveryModule,
    KafkaModule,
  ],
  providers: [AnalyticsGateway, AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}

