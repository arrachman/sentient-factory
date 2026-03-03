type DuplicateExceptionType = 'bad_request' | 'conflict';
type ThrowDuplicateOptions = {
    fieldLabel: string;
    value?: string;
    isSoftDeleted?: boolean;
    type?: DuplicateExceptionType;
};
export declare function duplicateMessage(fieldLabel: string, value?: string, isSoftDeleted?: boolean): string;
export declare function throwDuplicate({ fieldLabel, value, isSoftDeleted, type, }: ThrowDuplicateOptions): never;
export declare function isUniqueViolation(error: unknown, targets: string[]): boolean;
export {};
