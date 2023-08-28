import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { SignInDTO } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
  prisma = new PrismaClient();

  async signUp(signUpDTO: SignUpDTO, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: signUpDTO.email
        }
      });

      if (!user) {
        const skills = signUpDTO.skill?.toString();
        const certifications = signUpDTO.certification?.toString();

        await this.prisma.user.create({
          data: {
            name: signUpDTO.name,
            email: signUpDTO.email,
            password: signUpDTO.password,
            phone: signUpDTO.phone,
            birthday: new Date(signUpDTO.birthday),
            gender: signUpDTO.gender,
            role: signUpDTO.role,
            skill: skills,
            certification: certifications
          }
        });
        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: 'Sign up successfully'
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

  async signIn(signInDto: SignInDTO, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: signInDto.email
        }
      });

      if (user) {
        if (user?.password === signInDto.password) {
          const payload = {
            sub: user.id,
            role: user.role
          };
          const token = await this.jwtService.signAsync(payload);

          // save the token to database
          await this.prisma.current_active_token.create({
            data: {
              sub: user.id,
              token
            }
          })

          return res.status(HttpStatus.CREATED).json({
            statusCode: 201,
            message: 'Sign in successfully',
            token
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: 'Wrong password'
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: 'Email does not exist'
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logOut(request: any, res: Response) {
    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      const filteredToken = type === 'Bearer' ? token : undefined;

      await this.prisma.current_active_token.delete({
        where: {
          token: filteredToken
        }
      });

      return res.status(HttpStatus.CREATED).json({
        statusCode: 201,
        message: 'Log out successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
