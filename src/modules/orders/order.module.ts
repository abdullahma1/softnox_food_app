import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { RestaurantModule } from '../restaurants/restaurant.module';
import {KafkaModule} from '../../kafka/kafka.module'
@Module({
  imports: [TypeOrmModule.forFeature([Order]), RestaurantModule ,KafkaModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

