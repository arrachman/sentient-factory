export declare class CreateSessionNoteDto {
    bookingId: number;
    noteText: string;
    isPrivate?: boolean;
}
declare const UpdateSessionNoteDto_base: import("@nestjs/common").Type<Partial<CreateSessionNoteDto>>;
export declare class UpdateSessionNoteDto extends UpdateSessionNoteDto_base {
}
export declare class QuerySessionNoteDto {
    page?: number;
    limit?: number;
    bookingId?: number;
    psikologUserId?: number;
    isPrivate?: boolean;
}
export {};
