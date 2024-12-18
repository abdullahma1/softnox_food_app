import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { OrderService } from '../orders/order.service';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private orderService: OrderService,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const order = await this.orderService.findOne(createDeliveryDto.orderId);
    const delivery = this.deliveryRepository.create({
      ...createDeliveryDto,
      order,
    });
    return await this.deliveryRepository.save(delivery);
  }

  async findAll(): Promise<Delivery[]> {
    return await this.deliveryRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({ where: { id }, relations: ['order'] });
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  async update(id: number, updateDeliveryDto: Partial<CreateDeliveryDto>): Promise<Delivery> {
    const delivery = await this.findOne(id);
    if (updateDeliveryDto.orderId) {
      delivery.order = await this.orderService.findOne(updateDeliveryDto.orderId);
    }
    Object.assign(delivery, updateDeliveryDto);
    return await this.deliveryRepository.save(delivery);
  }

  async remove(id: number): Promise<void> {
    const result = await this.deliveryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
  }
}

