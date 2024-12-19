import { Injectable } from '@nestjs/common';
// import { KafkaService } from '../../kafka/kafka.services';
import { ProducerService } from './producer.services'
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // private readonly kafkaService: KafkaService,
    private readonly producerService: ProducerService
  ) {}

  async create(orderData: any): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);

    console.log(order)
    await this.producerService.produce({
    topic:'test',
      messages:[
        {value:JSON.stringify(order)}
      ]
    });
    return orderData;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);
    // await this.kafkaService.emit('order_status_changed', {
    //   orderId: id,
    //   newStatus: status,
    //   restaurantId: order.restaurant.id
    // });
    return updatedOrder;
  }


  async update(id: number, orderData: any): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    const updatedOrder = await this.orderRepository.findOne({ where: { id } });
    // await this.kafkaService.emit('order_updated', {
    //   id: updatedOrder.id,
    //   restaurantId: updatedOrder.restaurant.id,
    //   status: updatedOrder.status,
    //   totalCost: updatedOrder.totalCost
    // });
    return updatedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}

