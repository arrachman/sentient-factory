"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WA_JOB_DEFAULTS = exports.WA_JOB_SEND = exports.WA_QUEUE_NAME = void 0;
exports.WA_QUEUE_NAME = 'clinic-wa';
exports.WA_JOB_SEND = 'send-message';
exports.WA_JOB_DEFAULTS = {
    attempts: 3,
    backoff: { type: 'fixed', delay: 5 * 60 * 1000 },
    removeOnComplete: { age: 7 * 24 * 3600, count: 1000 },
    removeOnFail: { age: 30 * 24 * 3600 },
};
//# sourceMappingURL=wa-queue.constants.js.map