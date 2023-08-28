import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobDetailCategoryDto {
    @ApiProperty({ description: "name", type: String })
    name: string;
    @ApiProperty({ description: "job_category_id", type: Number })
    job_category_id: number;
}
