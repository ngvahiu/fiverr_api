import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Put, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateJobUploadDto } from './dto/update-job-upload.dto';
import { FileUploadDTO } from 'src/file-upload.dto';
import { PaginationJobDTO } from './dto/pagination-job.dto';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

let imageUrl: string = null;

@ApiBearerAuth()
@ApiTags("Job")
@UseGuards(AuthGuard, RolesGuard)
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  // get job list
  @HttpCode(HttpStatus.OK)
  @Get()
  getJobList(@Res() res: Response) {
    return this.jobService.getJobList(res);
  }

  // get job list pagination
  @HttpCode(HttpStatus.OK)
  @Get("pagination")
  getJobPagination(@Query() paginationJobDTO: PaginationJobDTO, @Res() res: Response) {
    return this.jobService.getJobPagination(paginationJobDTO, res);
  }

  // get job list by searching
  @HttpCode(HttpStatus.OK)
  @Get("search/:searchName")
  getJobsBySearchName(@Param('searchName') searchName: string, @Res() res: Response) {
    return this.jobService.getJobsBySearchName(searchName, res);
  }

  // create job
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createJob(@Body() createJobDto: CreateJobDto, @Res() res: Response) {
    return this.jobService.createJob(createJobDto, res);
  }

  // get job
  @HttpCode(HttpStatus.OK)
  @Get(":id")
  getJob(@Param("id") id: string, @Res() res: Response) {
    if (isNaN(+id)) {
      return this.jobService.getJobsBySearchName(id.substring(7), res);
    }
    return this.jobService.getJob(+id, res);
  }

  // update job
  @HttpCode(HttpStatus.OK)
  @Put(":id")
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Res() res: Response) {
    return this.jobService.updateJob(+id, updateJobDto, res);
  }

  // update job upload
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'image', type: UpdateJobUploadDto })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/job",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.OK)
  @Put("upload/:id")
  updateJobUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    ) image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Res() res: Response) {
    return this.jobService.updateJobUpload(+id, updateJobDto, imageUrl, res);
  }

  // delete job 
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteJob(@Param('id') id: string, @Res() res: Response) {
    return this.jobService.deleteJob(+id, res);
  }

  // upload image
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'image', type: FileUploadDTO })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/job",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @Post("upload-image/:id")
  uploadImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) avatar: Express.Multer.File, @Param("id") id: string, @Res() res: Response) {
    return this.jobService.uploadImage(imageUrl, +id, res);
  }

  // get details of job
  @HttpCode(HttpStatus.OK)
  @Get('details/:id')
  getDetailsJob(@Param('id') id: string, @Res() res: Response) {
    return this.jobService.getDetailsJob(+id, res);
  }
}
