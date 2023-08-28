import { ApiProperty } from '@nestjs/swagger';

export class PaginationUserDTO {
    @ApiProperty({ description: "pageIndex", type: Number })
    pageIndex: number;
    @ApiProperty({ description: "pageSize", type: Number })
    pageSize: number;
    @ApiProperty({ description: "keyword", type: String, required: false })
    keyword: string;
}
