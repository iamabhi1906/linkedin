import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { FollowService } from './services/follow.service';
import { FollowRequestService } from './services/follow-request.service';
import { FollowQueryService } from './services/follow-query.service';
import { FollowController } from './controllers/follow.controller';
import { FollowRequestController } from './controllers/follow-request.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), TokenModule],
  controllers: [FollowController, FollowRequestController],
  providers: [FollowService, FollowRequestService, FollowQueryService],
  exports: [FollowService, FollowRequestService, FollowQueryService],
})
export class FollowsModule {}
