import { Module } from '@nestjs/common';
import { EmailService } from './email/email.services';

import { ConfigModule } from '@nestjs/config';
import { NotificaionCusomer } from './NotificaionCusomer.service';
import { ConsumerService } from './consumer';
// import { NotificaionCusomer } from './notificaionCusomer';

@Module({
  imports: [ ConfigModule],
  providers: [NotificaionCusomer,EmailService,ConsumerService],
  exports: [NotificaionCusomer],
})
export class NotificationsModule {}

