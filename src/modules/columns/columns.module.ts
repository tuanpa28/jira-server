import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { Column } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Column])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}