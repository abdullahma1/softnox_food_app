import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Delivery } from './delivery.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/auth_roles.guard';
import { Roles } from '../../auth/auth_roles.decorator';

@Controller('deliveries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Roles('admin', 'restaurant')
  create(@Body() createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  @Roles('admin', 'restaurant')
  findAll(): Promise<Delivery[]> {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'restaurant')
  findOne(@Param('id') id: string): Promise<Delivery> {
    return this.deliveryService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin', 'restaurant')
  update(@Param('id') id: string, @Body() updateDeliveryDto: Partial<CreateDeliveryDto>): Promise<Delivery> {
    return this.deliveryService.update(+id, updateDeliveryDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.deliveryService.remove(+id);
  }
}

