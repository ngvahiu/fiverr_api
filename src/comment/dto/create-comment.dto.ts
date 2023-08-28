import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: "job_id", type: Number })
    job_id: number;
    @ApiProperty({ description: "user_id", type: Number })
    user_id: number;
    @ApiProperty({ description: "content", type: String })
    content: string;
    @ApiProperty({ description: "stars", type: Number })
    stars: number;
}
