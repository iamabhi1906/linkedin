import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { LocalStorageStrategy } from './strategies/local-storage.strategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [UploadsController],
  providers: [
    LocalStorageStrategy,
    {
      provide: 'STORAGE_STRATEGY',
      useClass: LocalStorageStrategy,
    },
    UploadsService,
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
