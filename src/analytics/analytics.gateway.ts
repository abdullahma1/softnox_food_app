import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrderService } from '../modules/orders/order.service';
import { DeliveryService } from '../modules/delivery/delivery.service';

@WebSocketGateway()
export class AnalyticsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly orderService: OrderService,
    private readonly deliveryService: DeliveryService,
  ) {}

  @SubscribeMessage('getRealtimeAnalytics')
  async handleRealtimeAnalytics() {
    const orders = await this.orderService.findAll();
    const deliveries = await this.deliveryService.findAll();

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalCost, 0),
      averageDeliveryTime: this.calculateAverageDeliveryTime(deliveries),
    };

    this.server.emit('realtimeAnalytics', analytics);
  }

  private calculateAverageDeliveryTime(deliveries: any[]): number {
    if (deliveries.length === 0) return 0;

    const totalTime = deliveries.reduce((sum, delivery) => sum + delivery.estimatedDuration, 0);
    return totalTime / deliveries.length;
  }
}

