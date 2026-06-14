export type LocalDateParts = {
    dow: number;
    dateStr: string;
    hhmm: string;
};
export declare function localPartsInTimezone(d: Date, timezone?: string): LocalDateParts;
export declare function localDateAtMidnight(dateStr: string, timezone?: string): Date;
export declare function dateStrToDateColumn(dateStr: string): Date;
