import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaginationJobCategoryDTO } from './dto/pagination-job-category.dto';

@Injectable()
export class JobCategoryService {
  prisma = new PrismaClient();

  async getAllJobCategory(res: Response) {
    try {
      const jobCategoryList = await this.prisma.job_category.findMany({
        include: {
          job_detail_category: true
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get job category list successfully",
        content: jobCategoryList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createJobCategory(createJobCategoryDto: CreateJobCategoryDto, res: Response) {
    try {
      const jobCategory = await this.prisma.job_category.findFirst({
        where: {
          name: createJobCategoryDto.name
        }
      });

      if (!jobCategory) {
        await this.prisma.job_category.create({
          data: {
            ...createJobCategoryDto
          }
        });
        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Create job category successfully'
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Job category name already existed'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJobCategoryPagination(paginationJobCategoryDto: PaginationJobCategoryDTO, res: Response) {
    try {
      const { pageIndex, pageSize, keyword } = paginationJobCategoryDto;

      const jobCategoryList = await this.prisma.job_category.findMany({
        skip: +pageIndex,
        take: +pageSize,
        where: {
          name: {
            contains: keyword,
          },
        },
        include: {
          job_detail_category: true
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get job category list successfully',
        content: jobCategoryList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJobCategory(id: number, res: Response) {
    try {
      const jobCategory = await this.prisma.job_category.findFirst({
        where: {
          id: id
        },
        include: {
          job_detail_category: true
        }
      });

      if (jobCategory) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get job category successfully',
          content: jobCategory
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job category ID not found',
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateJobCategory(id: number, updateJobCategoryDto: UpdateJobCategoryDto, res: Response) {
    try {
      const jobCategory = await this.prisma.job_category.findFirst({
        where: {
          id
        }
      });

      if (jobCategory) {
        const checkJobCategory = await this.prisma.job_category.findFirst({
          where: {
            name: updateJobCategoryDto.name
          }
        });

        if (!checkJobCategory) {
          const updatedJobCategory = await this.prisma.job_category.update({
            where: {
              id
            },
            data: updateJobCategoryDto,
            include: {
              job_detail_category: true
            }
          });

          return res.status(HttpStatus.OK).json({
            statusCode: 200,
            message: 'Update job category successfully',
            content: updatedJobCategory
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'New job category name already existed'
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteJobCategory(id: number, res: Response) {
    try {
      const jobCategory = await this.prisma.job_category.findFirst({
        where: {
          id
        }
      });

      if (jobCategory) {
        await this.prisma.job_category.delete({
          where: {
            id
          }
        })
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete job category successfully'
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job category ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
