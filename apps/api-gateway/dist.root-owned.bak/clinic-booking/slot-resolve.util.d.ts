export type SlotDef = {
    start: string;
    end: string;
    label?: string;
};
export type SlotOverride = {
    index: number;
    start: string;
    end: string;
};
export declare function resolveServiceSlots(globalSlots: SlotDef[], overrides: SlotOverride[] | null | undefined): SlotDef[];
