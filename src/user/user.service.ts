import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { PaginationUserDTO } from './dto/pagination-user.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  async getAllUsers(res: Response) {
    try {
      const userList = await this.prisma.user.findMany();
      let userListResponse = [];

      userList.forEach(user => {
        userListResponse = [...userListResponse, {
          ...user,
          skill: user.skill.split(','),
          certification: user.certification.split(',')
        }]
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: "Get users list successfully",
        content: userListResponse
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(createUserDto: CreateUserDto, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: createUserDto.email
        }
      });

      if (!user) {
        const skills = createUserDto.skill?.toString();
        const certifications = createUserDto.certification?.toString();

        await this.prisma.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            phone: createUserDto.phone,
            birthday: new Date(createUserDto.birthday),
            gender: createUserDto.gender,
            role: createUserDto.role,
            skill: skills,
            certification: certifications
          }
        });
        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Create user successfully'
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: 'Email already existed'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id
        }
      });

      if (user) {
        // if (user.avatar) {
        //   //delete old file in server
        //   fs.unlinkSync(process.cwd() + "\\public\\avatar\\" + user.avatar);
        // }

        await this.prisma.user.delete({
          where: {
            id: id
          }
        });

        //revoke all tokens of the user's account
        await this.prisma.current_active_token.deleteMany({
          where: {
            sub: id
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Delete user successfully'
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

  async getUsersPagination(paginationUserDto: PaginationUserDTO, res: Response) {
    try {
      const { pageIndex, pageSize, keyword } = paginationUserDto;

      const userList = await this.prisma.user.findMany({
        skip: +pageIndex,
        take: +pageSize,
        where: {
          name: {
            contains: keyword,
          },
        },
      });
      let userListResponse = [];

      userList.forEach(user => {
        userListResponse = [...userListResponse, {
          ...user,
          skill: user.skill.split(','),
          certification: user.certification.split(',')
        }]
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get users successfully',
        content: userListResponse
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(id: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id
        }
      });

      if (user) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Get user successfully',
          content: {
            ...user,
            skill: user.skill.split(','),
            certification: user.certification.split(',')
          }
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

  async updateUser(id: number, updateUserDto: UpdateUserDto, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id
        }
      });

      if (user) {
        const skills = updateUserDto.skill?.toString();
        const certifications = updateUserDto.certification?.toString();

        const updatedUser = await this.prisma.user.update({
          where: {
            id
          },
          data: {
            ...updateUserDto,
            birthday: new Date(updateUserDto.birthday),
            skill: skills,
            certification: certifications
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: 'Update user successfully',
          content: updatedUser
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

  async getUsersBySearchName(searchName: string, res: Response) {
    try {
      const userList = await this.prisma.user.findMany({
        where: {
          name: {
            contains: searchName
          }
        }
      });
      let userListResponse = [];

      userList.forEach(user => {
        userListResponse = [...userListResponse, {
          ...user,
          skill: user.skill.split(','),
          certification: user.certification.split(',')
        }]
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get users by searching name successfully',
        content: userListResponse
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAvatar(imageUrl: string, id: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id
        }
      });

      if (user) {
        // if (user.avatar) {
        //   //delete old file in server
        //   fs.unlinkSync(process.cwd() + "\\public\\avatar\\" + user.avatar);
        // }

        const updatedUser = await this.prisma.user.update({
          where: {
            id
          },
          data: {
            ...user,
            avatar: imageUrl
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Upload avatar successfully',
          content: updatedUser
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
