import { Module } from '@nestjs/common';
import { LiveNotificationsController } from './live_notifications.controller';
import { LiveNotificationsService } from './live_notifications.service';

@Module({
  controllers: [LiveNotificationsController],
  providers: [LiveNotificationsService]
})
export class LiveNotificationsModule {}
