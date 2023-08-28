import { Controller, Get, Post, Body, Param, Delete, Res, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, Query, Put } from '@nestjs/common';
import { JobDetailCategoryService } from './job-detail-category.service';
import { CreateJobDetailCategoryDto } from './dto/create-job-detail-category.dto';
import { UpdateJobDetailCategoryDto } from './dto/update-job-detail-category.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaginationJobDetailCategoryDTO } from './dto/pagination-job-detail.dto';
import { Roles } from 'src/RoleGuard/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDTO } from 'src/file-upload.dto';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateJobDetailCategoryUploadDto } from './dto/update-job-detail-category-upload.dto';

let imageUrl: string = null;

@ApiBearerAuth()
@ApiTags("Job Detail Category")
@UseGuards(AuthGuard, RolesGuard)
@Controller('job-detail-category')
export class JobDetailCategoryController {
  constructor(private readonly jobDetailCategoryService: JobDetailCategoryService) { }

  // get job detail category list
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllJobDetailCategory(@Res() res: Response) {
    return this.jobDetailCategoryService.getAllJobDetailCategory(res);
  }

  // create job detail category
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'image', type: CreateJobDetailCategoryDto })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/job-detail-category",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createJobDetailCategory(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) image: Express.Multer.File,
    @Body() createJobDetailCategoryDto: CreateJobDetailCategoryDto,
    @Res() res: Response
  ) {
    return this.jobDetailCategoryService.createJobDetailCategory(createJobDetailCategoryDto, imageUrl, res);
  }

  // get job detail category list pagination
  @HttpCode(HttpStatus.OK)
  @Get("pagination")
  getAllJobDetailCategoryPagination(@Query() paginationJobDetailCategoryDto: PaginationJobDetailCategoryDTO, @Res() res: Response) {
    return this.jobDetailCategoryService.getAllJobDetailCategoryPagination(paginationJobDetailCategoryDto, res);
  }

  // get job detail category
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getJobDetailCategory(@Param('id') id: string, @Res() res: Response) {
    return this.jobDetailCategoryService.getJobDetailCategory(+id, res);
  }

  // update job detail category
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateJobDetailCategory(
    @Param('id') id: string,
    @Body() updateJobDetailCategoryDto: UpdateJobDetailCategoryDto,
    @Res() res: Response) {
    return this.jobDetailCategoryService.updateJobDetailCategory(+id, updateJobDetailCategoryDto, res);
  }

  // update job detail category upload
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'image', type: UpdateJobDetailCategoryUploadDto })
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/job-detail-category",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.OK)
  @Put('update-upload/:id')
  updateJobDetailCategoryUploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    ) image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateJobDetailCategoryDto: UpdateJobDetailCategoryDto,
    @Res() res: Response) {
    return this.jobDetailCategoryService.updateJobDetailCategoryUpload(+id, updateJobDetailCategoryDto, imageUrl, res);
  }

  // delete job detail category
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteJobDetailCategory(@Param('id') id: string, @Res() res: Response) {
    return this.jobDetailCategoryService.deleteJobDetailCategory(+id, res);
  }

  // upload image job detail category
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'image', type: FileUploadDTO })
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/job-detail-category",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  @Post("upload/:id")
  uploadImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) avatar: Express.Multer.File, @Param("id") id: string, @Res() res: Response) {
    return this.jobDetailCategoryService.uploadImage(imageUrl, +id, res);
  }
}
