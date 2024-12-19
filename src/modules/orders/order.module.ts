import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { RestaurantModule } from '../restaurants/restaurant.module';
import {KafkaModule} from '../../kafka/kafka.module'
import {NotificationsModule} from '../../notification/notification.module'
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { ProducerService } from './producer.services';
@Module({
  imports: [TypeOrmModule.forFeature([Order]), RestaurantModule, KafkaModule , NotificationsModule],
  controllers: [OrderController],
  providers: [OrderService,ProducerService],
  exports: [OrderService,ProducerService],
})
export class OrderModule {}

