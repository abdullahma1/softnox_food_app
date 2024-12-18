import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { CreateDishDto } from './dto/create-dish.dto';
import { RestaurantService } from '../restaurants/restaurant.service';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    private restaurantService: RestaurantService,
  ) {}

  async create(createDishDto: CreateDishDto): Promise<Dish> {
    const restaurant = await this.restaurantService.findOne(createDishDto.restaurantId);
    const dish = this.dishRepository.create({
      ...createDishDto,
      restaurant,
    });
    return await this.dishRepository.save(dish);
  }

  async findAll(): Promise<Dish[]> {
    return await this.dishRepository.find({ relations: ['restaurant'] });
  }

  async findOne(id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne({ where: { id }, relations: ['restaurant'] });
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }
    return dish;
  }

  async update(id: number, updateDishDto: Partial<CreateDishDto>): Promise<Dish> {
    const dish = await this.findOne(id);
    if (updateDishDto.restaurantId) {
      dish.restaurant = await this.restaurantService.findOne(updateDishDto.restaurantId);
    }
    Object.assign(dish, updateDishDto);
    return await this.dishRepository.save(dish);
  }

  async remove(id: number): Promise<void> {
    const result = await this.dishRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }
  }
}

