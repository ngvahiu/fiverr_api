import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { PaginationJobDTO } from './dto/pagination-job.dto';

@Injectable()
export class JobService {
  prisma = new PrismaClient();

  async getJobList(res: Response) {
    try {
      const jobList = await this.prisma.job.findMany();

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get job list successfully",
        content: jobList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createJob(createJobDto: CreateJobDto, res: Response) {
    try {
      const {
        name,
        rate,
        price,
        description,
        short_description,
        stars,
        job_detail_category_id,
        creator,
      } = createJobDto;

      //check job detail category
      const jobDetailCategory = await this.prisma.job_detail_category.findFirst({
        where: {
          id: job_detail_category_id
        }
      });

      //check creator
      const user = await this.prisma.user.findFirst({
        where: {
          id: creator
        }
      });

      if (jobDetailCategory && user) {
        // check case concurring name with another job
        const job = await this.prisma.job.findFirst({
          where: {
            name,
            job_detail_category_id
          }
        });

        if (!job) {
          await this.prisma.job.create({
            data: {
              name,
              rate: +rate,
              price: +price,
              description,
              short_description,
              stars: +stars,
              job_detail_category_id: +job_detail_category_id,
              creator: +creator
            }
          });
          return res.status(HttpStatus.CREATED).json({
            statusCode: 201,
            message: 'Create job successfully'
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'Job name already exists'
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Job detail category id or creator ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJob(id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id: id
        }
      });

      if (job) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get job successfully',
          content: job
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

  async updateJob(id: number, updateJobDto: UpdateJobDto, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id
        }
      });

      if (job) {
        // check job_detail_category ID of updated job
        const checkJobDetailCategory = await this.prisma.job_detail_category.findFirst({
          where: {
            id: +updateJobDto.job_detail_category_id
          }
        });

        if (checkJobDetailCategory) {
          // check job's name
          const checkJob = await this.prisma.job.findFirst({
            where: {
              name: updateJobDto.name,
              job_detail_category_id: updateJobDto.job_detail_category_id
            }
          });

          if (!checkJob || checkJob.id === id) {
            const updatedJob = await this.prisma.job.update({
              where: {
                id
              },
              data: {
                ...updateJobDto
              }
            });

            return res.status(HttpStatus.OK).json({
              statusCode: 200,
              message: 'Update job successfully',
              content: updatedJob
            });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
              statusCode: 400,
              message: 'Job name already exists'
            });
          }
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: 404,
            message: 'Job Detail Category ID not found'
          });
        }
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

  async updateJobUpload(id: number, updateJobDto: UpdateJobDto, imageUrl: string, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id
        }
      });

      if (job) {
        // check job_detail_category ID of updated job
        const checkJobDetailCategory = await this.prisma.job_detail_category.findFirst({
          where: {
            id: +updateJobDto.job_detail_category_id
          }
        });

        if (checkJobDetailCategory) {
          // check job's name
          const checkJob = await this.prisma.job.findFirst({
            where: {
              name: updateJobDto.name,
              job_detail_category_id: +updateJobDto.job_detail_category_id
            }
          });

          if (!checkJob || checkJob.id === id) {
            // if (job.image) {
            //   //delete old file in server
            //   fs.unlinkSync(process.cwd() + "\\public\\job\\" + job.image);
            // }

            const updatedJob = await this.prisma.job.update({
              where: {
                id
              },
              data: {
                ...updateJobDto,
                rate: +updateJobDto.rate,
                price: +updateJobDto.price,
                stars: +updateJobDto.stars,
                job_detail_category_id: +updateJobDto.job_detail_category_id,
                creator: +updateJobDto.creator,
                image: imageUrl
              }
            });

            return res.status(HttpStatus.OK).json({
              statusCode: 200,
              message: 'Update job successfully',
              content: updatedJob
            });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
              statusCode: 400,
              message: 'Job name already exists'
            });
          }
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: 404,
            message: 'Job Detail Category ID not found'
          });
        }
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

  async deleteJob(id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id
        }
      });

      if (job) {
        await this.prisma.job.delete({
          where: {
            id
          }
        });

        // if (job.image) {
        //   //delete old file in server
        //   fs.unlinkSync(process.cwd() + "\\public\\job\\" + job.image);
        // }

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete job successfully'
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

  async uploadImage(imageUrl: string, id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id
        }
      });

      if (job) {
        // if (job.image) {
        //   //delete old file in server
        //   fs.unlinkSync(process.cwd() + "\\public\\job\\" + job.image);
        // }

        const updatedJob = await this.prisma.job.update({
          where: {
            id
          },
          data: {
            ...job,
            image: imageUrl
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Upload image successfully',
          content: updatedJob
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

  async getDetailsJob(id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id: id
        },
        include: {
          user: true
        }
      });

      if (job) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get details of job successfully',
          content: job,
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

  async getJobsBySearchName(searchName: string, res: Response) {
    try {
      const jobList = await this.prisma.job.findMany({
        where: {
          name: {
            contains: searchName
          }
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get jobs by searching name successfully',
        content: jobList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getJobPagination(paginationJobDTO: PaginationJobDTO, res: Response) {
    try {
      const { pageIndex, pageSize, keyword } = paginationJobDTO;

      const jobList = await this.prisma.job.findMany({
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
        message: 'Get job list successfully',
        content: jobList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
