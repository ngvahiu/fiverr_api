import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from './user/user.module';
import { JobCategoryModule } from './job-category/job-category.module';
import { JobDetailCategoryModule } from './job-detail-category/job-detail-category.module';
import { JobModule } from './job/job.module';
import { CommentModule } from './comment/comment.module';
import { HireJobModule } from './hire-job/hire-job.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    JobCategoryModule,
    JobDetailCategoryModule,
    JobModule,
    CommentModule,
    HireJobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule { }
