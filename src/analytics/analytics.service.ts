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
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka
  ) {
    this.subscribeToOrderEvents();
  }

  private subscribeToOrderEvents() {
    this.kafkaClient.subscribeToResponseOf('order_created');
    this.kafkaClient.subscribeToResponseOf('order_updated');
    this.kafkaClient.subscribeToResponseOf('order_deleted');
  }

  async getPopularDishes(restaurantId: number): Promise<Dish[]> {
    return await this.dishRepository.createQueryBuilder('dish')
      .where('dish.restaurantId = :restaurantId', { restaurantId })
      .orderBy('dish.popularityScore', 'DESC')
      .limit(5)
      .getMany();
  }

  async getAverageDeliveryTimes(period: 'day' | 'week' | 'month'): Promise<number> {
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

    if (deliveries.length === 0) return 0;

    const totalTime = deliveries.reduce((sum, delivery) => sum + delivery.estimatedDuration, 0);
    return totalTime / deliveries.length;
  }

  async trackPeakHours(order: Order) {
    // Implement logic to track peak hours based on order data
    console.log(`Tracking peak hours for order: ${order.id}`);
  }

  async adjustRestaurantOperationTimes(restaurantId: number) {
    // Implement logic to adjust restaurant operation times based on analytics
    console.log(`Adjusting operation times for restaurant: ${restaurantId}`);
  }
}

