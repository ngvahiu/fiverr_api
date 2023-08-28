import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Res, UseGuards, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Response } from 'express';
import { Roles } from 'src/RoleGuard/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/RoleGuard/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@ApiTags("Comment")
@UseGuards(AuthGuard, RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // get comments
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  getCommentList(@Res() res: Response) {
    return this.commentService.getCommentList(res);
  }

  // create comment
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createComment(@Body() createCommentDto: CreateCommentDto, @Res() res: Response) {
    return this.commentService.createComment(createCommentDto, res);
  }

  // update comment
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Res() res: Response) {
    return this.commentService.updateComment(+id, updateCommentDto, res);
  }

  // delete comment
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteComment(@Param('id') id: string, @Res() res: Response) {
    return this.commentService.deleteComment(+id, res);
  }

  // get comment list by job id
  @HttpCode(HttpStatus.OK)
  @Get('by-job-id/:id')
  getCommentsByJobID(@Param('id') id: string, @Res() res: Response) {
    return this.commentService.getCommentsByJobID(+id, res);
  }

  // get comment list by user id
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get('by-user-id/:id')
  getCommentsByUserID(@Param('id') id: string, @Res() res: Response) {
    return this.commentService.getCommentsByUserID(+id, res);
  }
}
