import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './restaurant.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/auth_roles.guard';
import { Roles } from '../../auth/auth_roles.decorator';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles('admin')
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    console.log("creat")
    return this.restaurantService.create(createRestaurantDto);

  }

  @Get()
  @Roles('admin', 'restaurant')
  findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'restaurant')
  findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRestaurantDto: Partial<CreateRestaurantDto>): Promise<Restaurant> {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.restaurantService.remove(+id);
  }
}

