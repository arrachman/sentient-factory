"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveServiceSlots = resolveServiceSlots;
function resolveServiceSlots(globalSlots, overrides) {
    if (!overrides || overrides.length === 0)
        return globalSlots;
    const byIndex = new Map();
    for (const o of overrides)
        byIndex.set(o.index, o);
    return globalSlots.map((slot, i) => {
        const ov = byIndex.get(i);
        return ov ? { start: ov.start, end: ov.end, label: slot.label } : slot;
    });
}
//# sourceMappingURL=slot-resolve.util.js.map