import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { KafkaModule } from '../kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [KafkaModule, ConfigModule],
  providers: [NotificationService, EmailService],
  exports: [NotificationService],
})
export class NotificationsModule {}

