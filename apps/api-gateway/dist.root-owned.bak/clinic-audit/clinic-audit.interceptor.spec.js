"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const clinic_audit_interceptor_1 = require("./clinic-audit.interceptor");
function makeContext(method, path, user) {
    const req = { method, path, url: path, user, headers: {}, body: {}, params: {}, ip: '127.0.0.1' };
    return {
        switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({}) }),
        getHandler: () => ({}),
        getClass: () => ({}),
    };
}
describe('ClinicAuditInterceptor', () => {
    let reflector;
    let prisma;
    let interceptor;
    beforeEach(() => {
        reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) };
        prisma = { auditLog: { create: jest.fn().mockResolvedValue({}) } };
        interceptor = new clinic_audit_interceptor_1.ClinicAuditInterceptor(reflector, prisma);
    });
    it('skips non-clinic paths', (done) => {
        const ctx = makeContext('POST', '/api/master-data-items');
        const next = { handle: () => (0, rxjs_1.of)({ success: true }) };
        interceptor.intercept(ctx, next).subscribe(() => {
            setTimeout(() => {
                expect(prisma.auditLog.create).not.toHaveBeenCalled();
                done();
            }, 10);
        });
    });
    it('skips GET requests (read-only)', (done) => {
        const ctx = makeContext('GET', '/api/clinic/psikolog');
        const next = { handle: () => (0, rxjs_1.of)({ data: [] }) };
        interceptor.intercept(ctx, next).subscribe(() => {
            setTimeout(() => {
                expect(prisma.auditLog.create).not.toHaveBeenCalled();
                done();
            }, 10);
        });
    });
    it('audits POST to /clinic/psikolog with derived entity_type', (done) => {
        const ctx = makeContext('POST', '/api/clinic/psikolog', { sub: 141, id: 141 });
        const next = { handle: () => (0, rxjs_1.of)({ success: true, data: { id: 9 } }) };
        interceptor.intercept(ctx, next).subscribe(() => {
            setTimeout(() => {
                expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
                    data: expect.objectContaining({
                        userId: 141,
                        action: 'post',
                        entityType: 'clinic.psikolog',
                    }),
                }));
                done();
            }, 10);
        });
    });
    it('respects @SkipAudit() metadata', (done) => {
        reflector.getAllAndOverride.mockReturnValueOnce(true);
        const ctx = makeContext('POST', '/api/clinic/psikolog');
        const next = { handle: () => (0, rxjs_1.of)({ success: true }) };
        interceptor.intercept(ctx, next).subscribe(() => {
            setTimeout(() => {
                expect(prisma.auditLog.create).not.toHaveBeenCalled();
                done();
            }, 10);
        });
    });
    it('redacts password fields in body', (done) => {
        const ctx = makeContext('POST', '/api/clinic/psikolog', { id: 1 });
        ctx.switchToHttp().getRequest().body = {
            email: 'a@b.co',
            password: 'secret123',
            passwordHash: 'hashed',
            token: 'tok',
            title: 'M.Psi',
        };
        const next = { handle: () => (0, rxjs_1.of)({ data: { id: 9 } }) };
        interceptor.intercept(ctx, next).subscribe(() => {
            setTimeout(() => {
                const call = prisma.auditLog.create.mock.calls[0]?.[0];
                const newData = call?.data?.newData;
                expect(newData?.password).toBe('[redacted]');
                expect(newData?.passwordHash).toBe('[redacted]');
                expect(newData?.token).toBe('[redacted]');
                expect(newData?.email).toBe('a@b.co');
                expect(newData?.title).toBe('M.Psi');
                done();
            }, 10);
        });
    });
});
//# sourceMappingURL=clinic-audit.interceptor.spec.js.map