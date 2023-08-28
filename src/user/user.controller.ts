import { Controller, Get, Post, Body, Param, Delete, Res, HttpCode, HttpStatus, UseGuards, Query, Put, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
// import { AuthGuard } from '@nestjs/passport';
import { PaginationUserDTO } from './dto/pagination-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/RoleGuard/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDTO } from 'src/file-upload.dto';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

let imageUrl: string = null;

@ApiBearerAuth()
@ApiTags("User")
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // get user list
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllUsers(@Res() res: Response) {
    return this.userService.getAllUsers(res);
  }

  // create user
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.userService.createUser(createUserDto, res);
  }

  // delete user
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.userService.deleteUser(+id, res);
  }

  // get user list pagination
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get("pagination")
  getUsersPagination(@Query() paginationUserDto: PaginationUserDTO, @Res() res: Response) {
    return this.userService.getUsersPagination(paginationUserDto, res);
  }

  // get user
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUser(@Param('id') id: string, @Res() res: Response) {
    if (isNaN(+id)) {
      return this.userService.getUsersBySearchName(id.substring(7), res);
    }
    return this.userService.getUser(+id, res);
  }

  // update user
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return this.userService.updateUser(+id, updateUserDto, res);
  }

  // get user list by searching
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get('search/:searchName')
  getUsersBySearchName(@Param('searchName') searchName: string, @Res() res: Response) {
    return this.userService.getUsersBySearchName(searchName, res);
  }

  // upload avatar
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'avatar', type: FileUploadDTO })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/avatar",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  @Post("upload-avatar/:id")
  uploadAvatar(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) avatar: Express.Multer.File, @Param("id") id: string, @Res() res: Response) {
    return this.userService.uploadAvatar(imageUrl, +id, res);
  }
}
