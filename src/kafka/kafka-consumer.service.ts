import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.services';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(private kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.subscribeToTopics();
  }

  private async subscribeToTopics() {
    await this.kafkaService.subscribe('order_created', this.handleOrderCreated.bind(this));
    await this.kafkaService.subscribe('order_updated', this.handleOrderUpdated.bind(this));
  }

  private async handleOrderCreated(orderData: any) {
    console.log('Order Created:', orderData);
    // Add your logic here to handle order creation
  }

  private async handleOrderUpdated(orderData: any) {
    console.log('Order Updated:', orderData);
    // Add your logic here to handle order updates
  }
}

