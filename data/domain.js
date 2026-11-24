// Pure helpers shared by the React Native application and node:test coverage.
export const nowISO = () => new Date().toISOString();
export const newId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
export const parseMoney = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : NaN;
  const input = String(value ?? '').trim();
  // Input accepts numeric amounts, ₱ formatting and legacy "₱300/hr" text.
  if (!/^(?:₱\s*)?\d+(?:,\d{3})*(?:\.\d{1,2})?(?:\/hr)?$/i.test(input)) return NaN;
  const amount = Number(input.replace(/₱|,|\/hr/gi, '').trim());
  return Number.isFinite(amount) ? amount : NaN;
};
export const money = (value) => `₱${Number(value || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })}`;
export function normalizeWorker(worker) {
  if (Number.isFinite(worker.minimumServiceFee)) return worker;
  // Legacy hourlyRate / "₱300/hr" was *not* a verified minimum fee. The numeric
  // value is a provisional demo migration and MUST be confirmed by the worker.
  const source = worker.minimumServiceFee ?? worker.rate ?? worker.hourlyRate ?? 0;
  const fee = parseMoney(source);
  return {
    ...worker,
    minimumServiceFee: Number.isFinite(fee) ? fee : 0,
    pricingNeedsReview: true,
    legacyRate: worker.legacyRate ?? worker.rate ?? worker.hourlyRate ?? null,
  };
}
export const isActiveBooking = (b) => ['Pending', 'Upcoming'].includes(b.status);
export const canChangeBooking = (b) => isActiveBooking(b);
export const validFutureDate = (date, time) => {
  // Use YYYY-MM-DD and 24-hour HH:mm, unambiguous local date / time.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(time))) return false;
  const parsed = new Date(`${date}T${time}:00`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.getFullYear() === Number(date.slice(0,4)) &&
    parsed.getMonth()+1 === Number(date.slice(5,7)) &&
    parsed.getDate() === Number(date.slice(8,10)) &&
    parsed.getTime() > Date.now();
};
export function updateScheduleRecord(booking, date, time) {
  if (!canChangeBooking(booking)) throw new Error('Only pending or upcoming bookings can be rescheduled.');
  if (!validFutureDate(date, time)) throw new Error('Enter a future date (YYYY-MM-DD) and time (HH:mm, 24-hour).');
  const when = nowISO();
  return {
    ...booking,
    date,
    time,
    scheduledAt: `${date}T${time}:00`,
    rescheduleHistory: [...(booking.rescheduleHistory || []), { oldDate: booking.date, oldTime: booking.time, newDate: date, newTime: time, changedAt: when }],
    updatedAt: when,
  };
}
export function changeBookingStatusRecord(booking, status) {
  const allowed = {
    Pending: ['Upcoming', 'Cancelled'],
    Upcoming: ['Completed', 'Cancelled'],
    Completed: [],
    Cancelled: [],
  };
  if (!(allowed[booking.status] || []).includes(status)) throw new Error(`Cannot change ${booking.status} booking to ${status}.`);
  return { ...booking, status, updatedAt: nowISO(), statusHistory: [...(booking.statusHistory || []), { status, at: nowISO() }] };
}
export function reportsByUser(reports, userId) { return reports.filter(r => r.clientId === userId); }
export function averageRating(reviews, workerId) {
  const numbers = reviews.filter(r => r.workerId === workerId).map(r => Number(r.stars)).filter(n => n >= 1 && n <= 5);
  return numbers.length ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : null;
}
export function ensureUniqueReview(reviews, bookingId, clientId) {
  if (reviews.some(r => r.bookingId === bookingId && r.clientId === clientId)) throw new Error('This booking has already been rated.');
}
