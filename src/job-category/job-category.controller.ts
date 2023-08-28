import { Controller, Get, Post, Body, Param, Delete, Res, HttpCode, HttpStatus, UseGuards, Query, Put } from '@nestjs/common';
import { JobCategoryService } from './job-category.service';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { Response } from 'express';
import { PaginationJobCategoryDTO } from './dto/pagination-job-category.dto';
import { Roles } from 'src/RoleGuard/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@ApiTags("Job Category")
@UseGuards(AuthGuard, RolesGuard)
@Controller('job-category')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) { }

  // get job category list
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllJobCategory(@Res() res: Response) {
    return this.jobCategoryService.getAllJobCategory(res);
  }

  // create job category
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createJobCategory(@Body() createJobCategoryDto: CreateJobCategoryDto, @Res() res: Response) {
    return this.jobCategoryService.createJobCategory(createJobCategoryDto, res);
  }

  // get job category list pagination
  @HttpCode(HttpStatus.OK)
  @Get("pagination")
  getJobCategoryPagination(@Query() paginationJobCategoryDto: PaginationJobCategoryDTO, @Res() res: Response) {
    return this.jobCategoryService.getJobCategoryPagination(paginationJobCategoryDto, res);
  }

  // get job category
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getJobCategory(@Param('id') id: string, @Res() res: Response) {
    return this.jobCategoryService.getJobCategory(+id, res);
  }

  // update job category
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateJobCategory(@Param('id') id: string, @Body() updateJobCategoryDto: UpdateJobCategoryDto, @Res() res: Response) {
    return this.jobCategoryService.updateJobCategory(+id, updateJobCategoryDto, res);
  }

  // delete job category
  @Roles(Role.Admin)
  @Delete(':id')
  deleteJobCategory(@Param('id') id: string, @Res() res: Response) {
    return this.jobCategoryService.deleteJobCategory(+id, res);
  }
}
