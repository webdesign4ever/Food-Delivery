import { Module } from '@nestjs/common';
import { BagTypesService } from './bag-types.service';
import { BagTypesController } from './bag-types.controller';

@Module({
  controllers: [BagTypesController],
  providers: [BagTypesService]
})
export class BagTypesModule { }
