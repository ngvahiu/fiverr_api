import { ApiProperty } from '@nestjs/swagger';

export class CreateHireJobDto {
    @ApiProperty({ description: "job_id", type: Number })
    job_id: number;
    @ApiProperty({ description: "user_id", type: Number })
    user_id: number;
    @ApiProperty({ description: "completed", type: Boolean })
    completed: boolean;
}
