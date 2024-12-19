import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer';
import { EmailService } from './email/email.services'; // Import the EmailService

@Injectable()
export class NotificaionCusomer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly emailService: EmailService, // Inject EmailService
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topic: 'test' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            // Parse message value
            const messageValue = JSON.parse(message.value.toString('utf-8'));
            
            // Log message details
            console.log({
              value: messageValue,
              partition: partition.toString(),
              topic: topic.toString(),
            });

            // Send email (example: send order details)
            const emailSubject = `Order #${messageValue.id} Notification`;
            const emailText = `Hello,\n\nYour order with ID ${messageValue.id} is now ${messageValue.status}. 
            \nTotal cost: $${messageValue.totalCost}\nEstimated delivery time: ${messageValue.estimatedDeliveryTime}`;
            
            // Example: Sending the email to the user's email address
            await this.emailService.sendEmail('user-email@example.com', emailSubject, emailText);

          } catch (error) {
            console.error(`Error processing message: ${error.message}`);
          }
        },
      },
    );
  }
}
