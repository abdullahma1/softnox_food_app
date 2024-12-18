import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Dish } from '../modules/dish/dish.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/auth_roles.guard';
import { Roles } from '../auth/auth_roles.decorator';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('popular-dishes/:restaurantId')
  @Roles('admin', 'restaurant')
  getPopularDishes(@Param('restaurantId') restaurantId: string): Promise<Dish[]> {
    return this.analyticsService.getPopularDishes(+restaurantId);
  }

  @Get('delivery-times/:period')
  @Roles('admin')
  getAverageDeliveryTimes(@Param('period') period: 'day' | 'week' | 'month'): Promise<number> {
    return this.analyticsService.getAverageDeliveryTimes(period);
  }
}

