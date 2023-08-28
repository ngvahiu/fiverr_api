import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHireJobDto } from './dto/create-hire-job.dto';
import { UpdateHireJobDto } from './dto/update-hire-job.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { PaginationHireJobDTO } from './dto/pagination-hire-job.dto';

@Injectable()
export class HireJobService {
  prisma = new PrismaClient();

  async getHireJobList(res: Response) {
    try {
      const hireJobList = await this.prisma.hire_job.findMany();

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get hire job list successfully",
        content: hireJobList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createHireJob(createHireJobDto: CreateHireJobDto, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: +createHireJobDto.user_id
        }
      });
      const job = await this.prisma.job.findFirst({
        where: {
          id: +createHireJobDto.job_id
        }
      });

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'User ID not found'
        });
      }
      if (!job) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job ID not found'
        });
      }

      await this.prisma.hire_job.create({
        data: {
          user_id: +createHireJobDto.user_id,
          job_id: +createHireJobDto.job_id,
          hire_date: new Date(),
          completed: createHireJobDto.completed
        }
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: 201,
        message: 'Create hire job successfully !',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHireJobPagination(paginationHireJobDto: PaginationHireJobDTO, res: Response) {
    try {
      const { pageIndex, pageSize, keyword } = paginationHireJobDto;

      const hireJobList = await this.prisma.hire_job.findMany({
        skip: +pageIndex * +pageSize,
        take: +pageSize,
        where: {
          job: {
            name: {
              contains: keyword
            }
          },
        },
        include: {
          job: true
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get hire job list successfully',
        content: hireJobList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHireJob(id: number, res: Response) {
    try {
      const hireJob = await this.prisma.hire_job.findFirst({
        where: {
          id
        }
      });

      if (hireJob) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get hire job successfully',
          content: hireJob
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Hire job ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateHireJob(id: number, updateHireJobDto: UpdateHireJobDto, res: Response) {
    try {
      const hireJob = await this.prisma.hire_job.findFirst({
        where: {
          id
        }
      });

      if (hireJob) {
        const updatedHireJob = await this.prisma.hire_job.update({
          where: {
            id
          },
          data: {
            hire_date: new Date(updateHireJobDto.hire_date),
            completed: updateHireJobDto.completed
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Update hire job successfully !',
          content: updatedHireJob
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Hire job ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteHireJob(id: number, res: Response) {
    try {
      const hireJob = await this.prisma.hire_job.findFirst({
        where: {
          id: id
        }
      });

      if (hireJob) {
        await this.prisma.hire_job.delete({
          where: {
            id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete hire job successfully'
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Hire job ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHireJobsByUserId(id: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        }
      });

      if (user) {
        const hireJobList = await this.prisma.hire_job.findMany({
          where: {
            user_id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get hire job list successfully',
          content: hireJobList
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'User ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getHireJobsByJobId(id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id: id
        }
      });

      if (job) {
        const hireJobList = await this.prisma.hire_job.findMany({
          where: {
            job_id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get hire job list successfully',
          content: hireJobList
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async completeHireJob(id: number, res: Response) {
    try {
      const hireJob = await this.prisma.hire_job.findFirst({
        where: {
          id: id
        }
      });

      if (hireJob) {
        const updateHireJob = await this.prisma.hire_job.update({
          where: {
            id
          },
          data: {
            completed: true
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Complete hire job successfully',
          content: updateHireJob
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Hire job ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
