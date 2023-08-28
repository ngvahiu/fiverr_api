import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  async getCommentList(res: Response) {
    try {
      const commentList = await this.prisma.comment.findMany();

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get comment list successfully",
        content: commentList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createComment(createCommentDto: CreateCommentDto, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: +createCommentDto.user_id
        }
      });
      const job = await this.prisma.job.findFirst({
        where: {
          id: +createCommentDto.job_id
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

      await this.prisma.comment.create({
        data: {
          user_id: +createCommentDto.user_id,
          job_id: +createCommentDto.job_id,
          comment_date: new Date(),
          description: createCommentDto.content,
          stars_comment: +createCommentDto.stars
        }
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: 201,
        message: 'Create comment successfully !',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto, res: Response) {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: {
          id
        }
      });

      if (comment) {
        const updatedComment = await this.prisma.comment.update({
          where: {
            id
          },
          data: {
            description: updateCommentDto.content,
            comment_date: new Date(),
            stars_comment: +updateCommentDto.stars
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Update comment successfully !',
          content: updatedComment
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Comment ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteComment(id: number, res: Response) {
    try {
      const comment = await this.prisma.comment.findFirst({
        where: {
          id: id
        }
      });

      if (comment) {
        await this.prisma.comment.delete({
          where: {
            id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete comment successfully'
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Comment ID not found'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCommentsByJobID(id: number, res: Response) {
    try {
      const job = await this.prisma.job.findFirst({
        where: {
          id: id
        }
      });

      if (job) {
        const commentList = await this.prisma.comment.findMany({
          where: {
            job_id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get comment list by job ID successfully',
          comment: commentList
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

  async getCommentsByUserID(id: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        }
      });

      if (user) {
        const commentList = await this.prisma.comment.findMany({
          where: {
            user_id: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get comment list by user ID successfully',
          comment: commentList
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
}
