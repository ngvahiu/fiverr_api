import { Controller, Get, Post, Body, Param, Delete, Res, HttpCode, HttpStatus, UseGuards, Query, Put } from '@nestjs/common';
import { HireJobService } from './hire-job.service';
import { CreateHireJobDto } from './dto/create-hire-job.dto';
import { UpdateHireJobDto } from './dto/update-hire-job.dto';
import { Response } from 'express';
import { PaginationHireJobDTO } from './dto/pagination-hire-job.dto';
import { Roles } from 'src/RoleGuard/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@ApiTags("Hire Job")
@UseGuards(AuthGuard, RolesGuard)
@Controller('hire-job')
export class HireJobController {
  constructor(private readonly hireJobService: HireJobService) { }

  // get hire job list
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  getHireJobList(@Res() res: Response) {
    return this.hireJobService.getHireJobList(res);
  }

  // create hire job
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createHireJob(@Body() createHireJobDto: CreateHireJobDto, @Res() res: Response) {
    return this.hireJobService.createHireJob(createHireJobDto, res);
  }

  // get hire job list pagination
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get("pagination")
  getHireJobPagination(@Query() paginationHireJobDto: PaginationHireJobDTO, @Res() res: Response) {
    return this.hireJobService.getHireJobPagination(paginationHireJobDto, res);
  }

  // get hire job
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getHireJob(@Param('id') id: string, @Res() res: Response) {
    return this.hireJobService.getHireJob(+id, res);
  }

  // update hire job
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateHireJob(@Param('id') id: string, @Body() updateHireJobDto: UpdateHireJobDto, @Res() res: Response) {
    return this.hireJobService.updateHireJob(+id, updateHireJobDto, res);
  }

  // delete hire job
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteHireJob(@Param('id') id: string, @Res() res: Response) {
    return this.hireJobService.deleteHireJob(+id, res);
  }

  // get hire job list by user id
  @HttpCode(HttpStatus.OK)
  @Get("by-user-id/:id")
  getHireJobsByUserId(@Param("id") id: string, @Res() res: Response) {
    return this.hireJobService.getHireJobsByUserId(+id, res);
  }

  // get hire job list by job id
  @HttpCode(HttpStatus.OK)
  @Get("by-job-id/:id")
  getHireJobsByJobId(@Param("id") id: string, @Res() res: Response) {
    return this.hireJobService.getHireJobsByJobId(+id, res);
  }

  // complete hire job
  @HttpCode(HttpStatus.OK)
  @Put("complete/:id")
  completeHireJob(@Param("id") id: string, @Res() res: Response) {
    return this.hireJobService.completeHireJob(+id, res);
  }
}
