export declare class ErpAuthUserDto {
    id: string;
    username: string;
    name: string;
    email: string | null;
    erpLevel: string;
}
export declare class ErpAuthResponseDto {
    accessToken: string;
    user: ErpAuthUserDto;
}
