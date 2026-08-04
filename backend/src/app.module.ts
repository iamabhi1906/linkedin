import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/config/orm.config';
import { PasswordModule } from './password/password.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { MailModule } from './mail/mail.module';
import { UploadsModule } from './uploads/uploads.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrganizationMembersModule } from './organization-members/organization-members.module';
import { PostsModule } from './posts/posts.module';
import { PostMediaModule } from './post-media/post-media.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { LikesModule } from './likes/likes.module';
import { JobsModule } from './jobs/jobs.module';
import { JobApplicationsModule } from './job-applications/job-applications.module';
import { FollowsModule } from './follows/follows.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    TokenModule,
    EmailVerificationModule,
    MailModule,
    UsersModule,
    AuthModule,
    PasswordModule,
    UploadsModule,
    OrganizationsModule,
    OrganizationMembersModule,
    PostsModule,
    PostMediaModule,
    PostLikesModule,
    PostCommentsModule,
    LikesModule,
    JobsModule,
    JobApplicationsModule,
    FollowsModule,
    ConversationsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


