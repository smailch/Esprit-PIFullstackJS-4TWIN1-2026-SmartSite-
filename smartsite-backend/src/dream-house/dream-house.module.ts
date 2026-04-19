import { Module } from '@nestjs/common';
import { DreamHouseController } from './dream-house.controller';
import { DreamHouseService } from './dream-house.service';

@Module({
  controllers: [DreamHouseController],
  providers: [DreamHouseService],
})
export class DreamHouseModule {}
