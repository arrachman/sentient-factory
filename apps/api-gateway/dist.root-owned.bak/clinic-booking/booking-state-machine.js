"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_TRANSITIONS = void 0;
exports.VALID_TRANSITIONS = {
    checked_in: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
};
//# sourceMappingURL=booking-state-machine.js.map