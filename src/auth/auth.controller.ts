import { Controller, Post, Body, HttpCode, Res, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { Response } from 'express';
import { SignInDTO } from './dto/sign-in.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post("sign-up")
  signUp(@Body() signUpDTO: SignUpDTO, @Res() res: Response) {
    return this.authService.signUp(signUpDTO, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  signIn(@Body() signInDto: SignInDTO, @Res() res: Response) {
    return this.authService.signIn(signInDto, res);
  }

  // log out -> revoke token
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("log-out")
  logOut(@Request() request, @Res() res: Response) {
    return this.authService.logOut(request, res);
  }
}
