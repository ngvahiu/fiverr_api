import { ApiProperty } from '@nestjs/swagger';

export class UpdateHireJobDto {
    @ApiProperty({ description: "hire_date", type: String, default: 'yyyy-mm-dd hh:MM:ss' })
    hire_date: string;
    @ApiProperty({ description: "completed", type: Boolean })
    completed: boolean;
}
