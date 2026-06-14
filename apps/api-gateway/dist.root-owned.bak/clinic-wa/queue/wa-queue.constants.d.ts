export declare const WA_QUEUE_NAME = "clinic-wa";
export declare const WA_JOB_SEND = "send-message";
export type WaSendJobData = {
    logId: number;
    recipientPhone: string;
    body: string;
    metadata: Record<string, unknown>;
};
export declare const WA_JOB_DEFAULTS: {
    attempts: number;
    backoff: {
        type: "fixed";
        delay: number;
    };
    removeOnComplete: {
        age: number;
        count: number;
    };
    removeOnFail: {
        age: number;
    };
};
