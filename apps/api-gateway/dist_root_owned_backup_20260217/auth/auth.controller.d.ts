import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
                role: any;
                roles: any;
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
    logout(_req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            username: any;
            fullName: any;
            name: any;
            warehouseId: number | null;
            warehouseName: string | null;
            role: any;
            roles: any;
        };
    }>;
    refresh(_req: any): Promise<{
        success: boolean;
        data: {
            token: string;
            refreshToken: string;
        };
    }>;
    testRole(): {
        message: string;
    };
    testPermission(): {
        message: string;
    };
}
