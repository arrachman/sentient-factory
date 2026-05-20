export declare const WA_CATEGORIES: readonly ["pengingat", "jadwal", "onboarding", "bayar"];
export type WaCategory = (typeof WA_CATEGORIES)[number];
export declare const WA_RECIPIENTS: readonly ["klien", "psikolog"];
export declare class CreateTemplateDto {
    name: string;
    category: WaCategory;
    triggerEvent?: string;
    body: string;
    recipients: string[];
    isActive?: boolean;
}
declare const UpdateTemplateDto_base: import("@nestjs/common").Type<Partial<CreateTemplateDto>>;
export declare class UpdateTemplateDto extends UpdateTemplateDto_base {
}
export declare class QueryTemplateDto {
    page?: number;
    limit?: number;
    category?: WaCategory;
    search?: string;
    isActive?: boolean;
}
export declare class QueryWaLogDto {
    page?: number;
    limit?: number;
    status?: string;
    recipientPhone?: string;
    templateId?: number;
}
export declare class SendTestDto {
    phone: string;
    templateId?: number;
    body?: string;
    variables?: Record<string, string>;
}
export declare class FonnteWebhookDto {
    device?: string;
    id?: string;
    sender?: string;
    status?: string;
    state?: string;
    reason?: string;
}
export {};
