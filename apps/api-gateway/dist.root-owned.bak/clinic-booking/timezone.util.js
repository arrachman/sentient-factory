"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localPartsInTimezone = localPartsInTimezone;
exports.localDateAtMidnight = localDateAtMidnight;
exports.dateStrToDateColumn = dateStrToDateColumn;
const DOW_MAP = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};
function localPartsInTimezone(d, timezone = 'Asia/Jakarta') {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        hour12: false,
    }).formatToParts(d);
    const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
    const weekday = get('weekday');
    const dow = DOW_MAP[weekday] ?? 0;
    let hour = get('hour');
    if (hour === '24')
        hour = '00';
    return {
        dow,
        dateStr: `${get('year')}-${get('month')}-${get('day')}`,
        hhmm: `${hour}:${get('minute')}`,
    };
}
function localDateAtMidnight(dateStr, timezone = 'Asia/Jakarta') {
    const offset = getTimezoneOffsetString(dateStr, timezone);
    return new Date(`${dateStr}T00:00:00${offset}`);
}
function dateStrToDateColumn(dateStr) {
    return new Date(`${dateStr}T00:00:00.000Z`);
}
function getTimezoneOffsetString(dateStr, timezone) {
    const probe = new Date(`${dateStr}T00:00:00Z`);
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset',
    }).formatToParts(probe);
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+07:00';
    const m = tz.match(/GMT([+-]\d{2}:\d{2})/);
    return m ? m[1] : '+07:00';
}
//# sourceMappingURL=timezone.util.js.map