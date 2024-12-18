import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.services';
import { EmailService } from './email.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private emailService: EmailService
  ) {}

  async onModuleInit() {
    await this.subscribeToOrderEvents();
  }

  private async subscribeToOrderEvents() {
    await this.kafkaService.subscribe('order_created', this.handleOrderCreated.bind(this));
    await this.kafkaService.subscribe('order_updated', this.handleOrderUpdated.bind(this));
  }

  private async handleOrderCreated(orderData: any) {
    console.log('Order Created:', orderData);
    await this.sendOrderStatusUpdateEmail(orderData.id, orderData.status, orderData.userEmail);
  }

  private async handleOrderUpdated(orderData: any) {
    console.log('Order Updated:', orderData);
    await this.sendOrderStatusUpdateEmail(orderData.id, orderData.status, orderData.userEmail);
  }

  async sendOrderStatusUpdateEmail(orderId: number, status: string, userEmail: string) {
    const subject = `Order #${orderId} Status Update`;
    const html = this.getOrderStatusEmailTemplate(orderId, status);

    try {
      await this.emailService.sendEmail(userEmail, subject, html);
      console.log(`Sent email notification for order ${orderId}: Status changed to ${status}`);
    } catch (error) {
      console.error(`Failed to send email notification for order ${orderId}:`, error);
    }
  }

  async sendDelayedDeliveryAlert(orderId: number, estimatedDelay: number, userEmail: string) {
    const subject = `Order #${orderId} Delivery Delay`;
    const html = this.getDelayedDeliveryEmailTemplate(orderId, estimatedDelay);

    try {
      await this.emailService.sendEmail(userEmail, subject, html);
      console.log(`Sent delayed delivery alert for order ${orderId}: Estimated delay of ${estimatedDelay} minutes`);
    } catch (error) {
      console.error(`Failed to send delayed delivery alert for order ${orderId}:`, error);
    }
  }

  private getOrderStatusEmailTemplate(orderId: number, status: string): string {
    return `
      <html>
        <body>
          <h1>Order Status Update</h1>
          <p>Your order #${orderId} status has been updated to: <strong>${status}</strong></p>
          <p>Thank you for using our food delivery service!</p>
        </body>
      </html>
    `;
  }

  private getDelayedDeliveryEmailTemplate(orderId: number, estimatedDelay: number): string {
    return `
      <html>
        <body>
          <h1>Delivery Delay Notification</h1>
          <p>We apologize, but your order #${orderId} is experiencing a delay.</p>
          <p>The estimated delay is approximately ${estimatedDelay} minutes.</p>
          <p>We appreciate your patience and understanding.</p>
        </body>
      </html>
    `;
  }
}

