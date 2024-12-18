import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { RestaurantModule } from '../restaurants/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dish]), RestaurantModule],
  controllers: [DishController],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}

