import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.services';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.consume('order-status-update', 'notifications-group', async (message) => {
      const { orderId, status, email } = JSON.parse(message.value.toString());
      await this.sendOrderUpdateNotification(orderId, status, email);
    });
  }

  private async sendOrderUpdateNotification(orderId: number, status: string, email: string) {
    // Send email notification when the order status changes
    const subject = `Order ${orderId} Status Update`;
    const html = `<p>Your order with ID ${orderId} has been updated to: ${status}</p>`;
    try {
      await this.emailService.sendEmail(email, subject, html);
      console.log(`Notification sent for order ${orderId}: Status changed to ${status}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
