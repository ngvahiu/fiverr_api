import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
    @ApiProperty({ description: "name", type: String })
    name: string;
    @ApiProperty({ description: "rate", type: Number })
    rate: number;
    @ApiProperty({ description: "price", type: Number })
    price: number;
    @ApiProperty({ description: "description", type: String })
    description: string;
    @ApiProperty({ description: "short_description", type: String })
    short_description: string;
    @ApiProperty({ description: "stars", type: Number })
    stars: number;
    @ApiProperty({ description: "job_detail_category_id", type: Number })
    job_detail_category_id: number;
    @ApiProperty({ description: "creator_id", type: Number })
    creator: number;
}
