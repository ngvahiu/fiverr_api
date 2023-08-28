import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

const configService = new ConfigService();

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    prisma = new PrismaClient();

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: configService.get("SECRET_KEY")
                }
            );

            const data = await this.prisma.current_active_token.findFirst({
                where: {
                    token
                }
            });

            if (!data) {
                throw "Token could be revoked or The admin may delete this account.";
            }

            const currentTimestamp = new Date().getTime() / 1000;
            const tokenIsNotExpired = payload.exp > currentTimestamp;

            if (tokenIsNotExpired) {
                // 💡 We're assigning the payload to the request object here
                // so that we can access it in our route handlers
                request['user'] = payload;
            } else {
                throw "Expired token";
            }
        } catch (msg: any) {
            throw new UnauthorizedException(msg);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}