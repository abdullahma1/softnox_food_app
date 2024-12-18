import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish } from './dish.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/auth_roles.guard';
import { Roles } from '../../auth/auth_roles.decorator';

@Controller('dishes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @Roles('admin', 'restaurant')
  create(@Body() createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishService.create(createDishDto);
  }

  @Get()
  @Roles('admin', 'restaurant')
  findAll(): Promise<Dish[]> {
    return this.dishService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'restaurant')
  findOne(@Param('id') id: string): Promise<Dish> {
    return this.dishService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin', 'restaurant')
  update(@Param('id') id: string, @Body() updateDishDto: Partial<CreateDishDto>): Promise<Dish> {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  @Roles('admin', 'restaurant')
  remove(@Param('id') id: string): Promise<void> {
    return this.dishService.remove(+id);
  }
}

