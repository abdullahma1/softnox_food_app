import { Controller, Get, Post,Patch, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/auth_roles.guard';
import { Roles } from '../../auth/auth_roles.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('admin', 'user')
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @Roles('admin', 'user')
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  update(@Param('id') id: string, @Body() updateOrderDto: Partial<CreateOrderDto>): Promise<Order> {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Patch(':id/status')
  @Roles('admin', 'restaurant', 'rider')
  updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<Order> {
    return this.orderService.updateStatus(+id, status);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(+id);
  }

  @Get('active')
  @Roles('admin', 'restaurant','user')
  findActiveOrders(): Promise<Order[]> {
    return this.orderService.findActiveOrders();
  }
}

