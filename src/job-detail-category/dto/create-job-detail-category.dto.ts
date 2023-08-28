import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDetailCategoryDto {
    @ApiProperty({ description: "name", type: String })
    name: string;
    @ApiProperty({ description: "file", type: String, format: 'binary' })
    file: any;
    @ApiProperty({ description: "job_category_id", type: Number })
    job_category_id: number;
}
