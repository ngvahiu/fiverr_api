import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobCategoryDto {
    @ApiProperty({ description: "name", type: String })
    name: string;
}
