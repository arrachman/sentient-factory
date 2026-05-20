"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceStorageBaseDir = getAttendanceStorageBaseDir;
exports.resolveAttendanceSnapshotPath = resolveAttendanceSnapshotPath;
exports.persistSnapshot = persistSnapshot;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path = __importStar(require("path"));
function getAttendanceStorageBaseDir() {
    return (process.env.HR_ATTENDANCE_STORAGE_PATH ||
        path.resolve(process.cwd(), '../../temp/hr-attendance'));
}
function resolveAttendanceSnapshotPath(snapshotUrl, baseDir) {
    if (snapshotUrl.startsWith('/temp/hr-attendance/')) {
        return path.join(baseDir, snapshotUrl.replace('/temp/hr-attendance/', ''));
    }
    return path.resolve(snapshotUrl);
}
async function persistSnapshot(bucket, prefix, dataUrl) {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
        throw new common_1.BadRequestException('Snapshot data URL is invalid.');
    }
    const mimeType = match[1];
    const base64 = match[2];
    const extension = mimeType.includes('png') ? 'png' : 'jpg';
    const fileName = `${prefix}-${Date.now()}-${(0, crypto_1.randomUUID)()}.${extension}`;
    const baseDir = getAttendanceStorageBaseDir();
    const targetDir = path.join(baseDir, bucket);
    await (0, promises_1.mkdir)(targetDir, { recursive: true });
    const filePath = path.join(targetDir, fileName);
    await (0, promises_1.writeFile)(filePath, Buffer.from(base64, 'base64'));
    return filePath;
}
//# sourceMappingURL=hr-attendance-snapshot.js.map