import { CreatePsikologDto } from './create-psikolog.dto';
declare const UpdatePsikologDto_base: import("@nestjs/common").Type<Partial<Omit<CreatePsikologDto, "email" | "username" | "password">>>;
export declare class UpdatePsikologDto extends UpdatePsikologDto_base {
}
export {};
