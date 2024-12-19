import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Dish } from '../modules/dish/dish.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/auth_roles.guard';
import { Roles } from '../auth/auth_roles.decorator';
import { Order } from 'src/modules/orders/order.entity';

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
  @Roles('admin','restaurant')
  getAverageDeliveryTimes(@Param('period') period: 'day' | 'week' | 'month'): Promise<string> {
    return this.analyticsService.getAverageDeliveryTimes(period);
  }

  @Get('peak-ordering-times/:restaurantId/:period')
  @Roles('admin', 'restaurant')
  getPeakOrderingTimes(@Param('restaurantId') restaurantId: string, @Param('period') period: 'day' | 'week' | 'month'): Promise<any> {
    return this.analyticsService.getPeakOrderingTimes(+restaurantId, period);
  }

  @Get('incomplete-orders/:thresholdMinutes')
  @Roles('admin', 'restaurant')
  getIncompleteOrdersOlderThan(@Param('thresholdMinutes') thresholdMinutes: number): Promise<Order[]> {
    return this.analyticsService.getIncompleteOrdersOlderThan(thresholdMinutes);
  }
}

