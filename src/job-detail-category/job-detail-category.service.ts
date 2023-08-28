import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDetailCategoryDto } from './dto/create-job-detail-category.dto';
import { UpdateJobDetailCategoryDto } from './dto/update-job-detail-category.dto';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaginationJobDetailCategoryDTO } from './dto/pagination-job-detail.dto';
import * as fs from 'fs';

@Injectable()
export class JobDetailCategoryService {
  prisma = new PrismaClient();

  async getAllJobDetailCategory(res: Response) {
    try {
      const jobDetailCategoryList = await this.prisma.job_detail_category.findMany();

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get job detail category list successfully",
        content: jobDetailCategoryList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createJobDetailCategory(createJobDetailCategoryDto: CreateJobDetailCategoryDto, imageUrl: string, res: Response) {
    try {
      const {
        name,
        job_category_id
      } = createJobDetailCategoryDto;

      const jobCategory = await this.prisma.job_category.findFirst({
        where: {
          id: +job_category_id
        }
      });

      if (!jobCategory) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job category ID not found'
        });
      }

      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          name
        }
      });

      if (!jobDetailCategory) {
        await this.prisma.job_detail_category.create({
          data: {
            name,
            image: imageUrl,
            job_category_id: +job_category_id,
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Create job detail category successfully'
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Job detail category name already existed'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllJobDetailCategoryPagination(paginationJobDetailCategoryDto: PaginationJobDetailCategoryDTO, res: Response) {
    try {
      const { pageIndex, pageSize, keyword } = paginationJobDetailCategoryDto;

      const jobDetailCategoryList = await this.prisma.job_detail_category.findMany({
        skip: +pageIndex,
        take: +pageSize,
        where: {
          name: {
            contains: keyword,
          },
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get job detail category list successfully',
        content: jobDetailCategoryList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJobDetailCategory(id: number, res: Response) {
    try {
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id: id
        }
      });

      if (jobDetailCategory) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get job detail category successfully',
          content: jobDetailCategory
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateJobDetailCategory(id: number, updateJobDetailCategoryDto: UpdateJobDetailCategoryDto, res: Response) {
    try {
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id
        }
      });

      if (jobDetailCategory) {
        const checkJobDetailCategory = await this.prisma.job_detail_category.findFirst({
          where: {
            name: updateJobDetailCategoryDto.name
          }
        });

        if (!checkJobDetailCategory || checkJobDetailCategory.id === id) {
          const checkJobCategory = await this.prisma.job_category.findFirst({
            where: {
              id: +updateJobDetailCategoryDto.job_category_id
            }
          });

          if (checkJobCategory) {
            const updatedJobDetailCategory = await this.prisma.job_detail_category.update({
              where: {
                id
              },
              data: {
                name: updateJobDetailCategoryDto.name,
                job_category_id: updateJobDetailCategoryDto.job_category_id
              }
            });

            return res.status(HttpStatus.OK).json({
              statusCode: 200,
              message: 'Update job detail category successfully',
              content: updatedJobDetailCategory
            });
          } else {
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: 404,
              message: 'Updated job category ID not found'
            });
          }
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'New job detail category name already existed'
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateJobDetailCategoryUpload(id: number, updateJobDetailCategoryDto: UpdateJobDetailCategoryDto, imageUrl: string, res: Response) {
    try {
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id
        }
      });

      if (jobDetailCategory) {
        const checkJobDetailCategory = await this.prisma.job_detail_category.findFirst({
          where: {
            name: updateJobDetailCategoryDto.name
          }
        });

        if (!checkJobDetailCategory || checkJobDetailCategory.id === jobDetailCategory.id) {
          const checkJobCategory = await this.prisma.job_category.findFirst({
            where: {
              id: +updateJobDetailCategoryDto.job_category_id
            }
          });

          if (checkJobCategory) {
            if (jobDetailCategory.image) {
              //delete old file in server
              fs.unlinkSync(process.cwd() + "\\public\\job-detail-category\\" + jobDetailCategory.image);
            }

            const updatedJobDetailCategory = await this.prisma.job_detail_category.update({
              where: {
                id
              },
              data: {
                name: updateJobDetailCategoryDto.name,
                job_category_id: +updateJobDetailCategoryDto.job_category_id,
                image: imageUrl
              }
            });

            return res.status(HttpStatus.OK).json({
              statusCode: 200,
              message: 'Update job detail category successfully',
              content: updatedJobDetailCategory
            });
          } else {
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: 404,
              message: 'Updated job category ID not found'
            });
          }
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'New job detail category name already existed'
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteJobDetailCategory(id: number, res: Response) {
    try {
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id
        }
      });

      if (jobDetailCategory) {
        await this.prisma.job_detail_category.delete({
          where: {
            id
          }
        });

        if (jobDetailCategory.image) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + "\\public\\job-detail-category\\" + jobDetailCategory.image);
        }

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete job detail category successfully'
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadImage(imageUrl: string, id: number, res: Response) {
    try {
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id
        }
      });

      if (jobDetailCategory) {
        if (jobDetailCategory.image) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + "\\public\\job-detail-category\\" + jobDetailCategory.image);
        }

        const updatedJobDetailCategory = await this.prisma.job_detail_category.update({
          where: {
            id
          },
          data: {
            ...jobDetailCategory,
            image: imageUrl
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Upload image successfully',
          content: updatedJobDetailCategory
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
