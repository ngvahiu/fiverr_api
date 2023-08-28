import { ApiProperty } from '@nestjs/swagger';

export class SignUpDTO {
    @ApiProperty({ description: "name", type: String })
    name: string;
    @ApiProperty({ description: "email", type: String })
    email: string;
    @ApiProperty({ description: "password", type: String })
    password: string;
    @ApiProperty({ description: "phone", type: String })
    phone: string;
    @ApiProperty({ description: "birthday", type: String, default: 'yyyy-mm-dd' })
    birthday: string;
    @ApiProperty({ description: "gender", type: String })
    gender: string;
    @ApiProperty({ description: "role", type: String, default: 'user' })
    role: string;
    @ApiProperty({ description: "skill", type: [String] })
    skill: string[];
    @ApiProperty({ description: "certification", type: [String] })
    certification: string[];
}
