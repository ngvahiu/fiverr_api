import { Module } from '@nestjs/common';
import { JobDetailCategoryService } from './job-detail-category.service';
import { JobDetailCategoryController } from './job-detail-category.controller';

@Module({
  controllers: [JobDetailCategoryController],
  providers: [JobDetailCategoryService]
})
export class JobDetailCategoryModule {}
