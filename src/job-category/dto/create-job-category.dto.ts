import { ApiProperty } from '@nestjs/swagger';

export class CreateJobCategoryDto {
    @ApiProperty({ description: "name", type: String })
    name: string;
}
