import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        success: boolean;
        data: {
            token: string;
            refreshToken: string;
            user: {
                id: any;
                email: any;
                username: any;
                fullName: any;
                name: any;
                warehouseId: number | null;
                warehouseName: string | null;
                role: string;
                roles: string[];
                createdAt: any;
            };
        };
        message: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            id: number;
            email: string;
            name: string | null;
            username: string;
            role: string;
            createdAt: Date;
        };
        message: string;
    }>;
    getProfile(authUser: any): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            username: any;
            fullName: any;
            name: any;
            warehouseId: number | null;
            warehouseName: string | null;
            roles: string[];
        };
    }>;
}
