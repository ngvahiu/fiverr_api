import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
    @ApiProperty({ description: "content", type: String })
    content: string;
    @ApiProperty({ description: "stars", type: Number })
    stars: number;
}
