"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffMinutes = diffMinutes;
function diffMinutes(clockInAt) {
    if (!clockInAt)
        return 0;
    const start = new Date(clockInAt);
    const end = new Date();
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}
//# sourceMappingURL=attendance-clock.utils.js.map