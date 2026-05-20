import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const ErpJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class ErpJwtStrategy extends ErpJwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        username: any;
        erpLevel: any;
        sid: any;
    }>;
}
export {};
