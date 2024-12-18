import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantService } from '../restaurants/restaurant.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private restaurantService: RestaurantService,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const restaurant = await this.restaurantService.findOne(createOrderDto.restaurantId);
    const order = this.orderRepository.create({
      ...createOrderDto,
      restaurant,
    });
    const savedOrder = await this.orderRepository.save(order);
    
    // Publish Kafka event
    this.kafkaClient.emit('order_created', JSON.stringify(savedOrder));
    
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['restaurant', 'delivery'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['restaurant', 'delivery'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = status; // Update the status
    return this.orderRepository.save(order); // Save the changes
  }

  async update(id: number, updateOrderDto: Partial<CreateOrderDto>): Promise<Order> {
    const order = await this.findOne(id);
    if (updateOrderDto.restaurantId) {
      order.restaurant = await this.restaurantService.findOne(updateOrderDto.restaurantId);
    }
    Object.assign(order, updateOrderDto);
    const updatedOrder = await this.orderRepository.save(order);
    
    // Publish Kafka event
    this.kafkaClient.emit('order_updated', JSON.stringify(updatedOrder));
    
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    // Publish Kafka event
    this.kafkaClient.emit('order_deleted', JSON.stringify({ id }));
  }

  async findActiveOrders(): Promise<Order[]> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    return await this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .where('order.status != :status', { status: 'completed' })
      .andWhere('order.orderTime <= :time', { time: thirtyMinutesAgo })
      .getMany();
  }
}





