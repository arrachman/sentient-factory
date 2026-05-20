export declare const ROOM_TYPES: readonly ["konseling", "anak", "tes", "seminar"];
export type RoomType = (typeof ROOM_TYPES)[number];
export declare class CreateRoomDto {
    name: string;
    type: RoomType;
    capacity?: number;
    facilities?: string[];
    description?: string;
    isActive?: boolean;
}
declare const UpdateRoomDto_base: import("@nestjs/common").Type<Partial<CreateRoomDto>>;
export declare class UpdateRoomDto extends UpdateRoomDto_base {
}
export declare class QueryRoomDto {
    page?: number;
    limit?: number;
    search?: string;
    type?: RoomType;
    isActive?: boolean;
}
export {};
