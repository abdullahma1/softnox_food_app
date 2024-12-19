import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Order } from '../modules/orders/order.entity';
import { Dish } from '../modules/dish/dish.entity';
import { Delivery } from '../modules/delivery/delivery.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,

  ) {}


  async getPopularDishes(restaurantId: number): Promise<Dish[]> {
    return await this.dishRepository.createQueryBuilder('dish')
      .where('dish.restaurantId = :restaurantId', { restaurantId })
      .orderBy('dish.popularityScore', 'DESC')
      .limit(5)
      .getMany();
  }

  async getAverageDeliveryTimes(period: 'day' | 'week' | 'month'): Promise<string> {
    const startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const deliveries = await this.deliveryRepository.createQueryBuilder('delivery')
      .where('delivery.deliveryTime >= :startDate', { startDate })
      .getMany();

    if (deliveries.length === 0) return null;

    const totalTime = deliveries.reduce((sum, delivery) => sum + delivery.estimatedDuration, 0);
    return `${period} = ${totalTime / deliveries.length}`;
  }

  async trackPeakHours(order: Order) {
    // Implement logic to track peak hours based on order data
    console.log(`Tracking peak hours for order: ${order.id}`);
  }

  async adjustRestaurantOperationTimes(restaurantId: number) {
    // Implement logic to adjust restaurant operation times based on analytics
    console.log(`Adjusting operation times for restaurant: ${restaurantId}`);
  }



  async getIncompleteOrdersOlderThan(thresholdMinutes: number): Promise<Order[]> {
    const thresholdDate = new Date();
    thresholdDate.setMinutes(thresholdDate.getMinutes() - thresholdMinutes); // 30 minutes ago

    return await this.orderRepository.createQueryBuilder('order')
      .where('order.status != :status', { status: 'completed' })  // Adjust this condition based on your order status field
      .andWhere('order.timestamp <= :thresholdDate', { thresholdDate })
      .getMany();
  }


  async getPeakOrderingTimes(restaurantId: number, period: 'day' | 'week' | 'month'): Promise<any> {
    const startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Fetch orders placed during the specified period
    const orders = await this.orderRepository.createQueryBuilder('order')
      .where('order.restaurantId = :restaurantId', { restaurantId })
      .andWhere('order.timestamp >= :startDate', { startDate })
      .select("DATE_TRUNC('hour', order.timestamp)", 'hour')  // Group by hour (can adjust for day, week, etc.)
      .addSelect('COUNT(order.id)', 'orderCount')
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return orders;
  }


}


