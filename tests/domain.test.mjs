import test from 'node:test';
import assert from 'node:assert/strict';
import {
 normalizeWorker,parseMoney,validFutureDate,updateScheduleRecord,
 changeBookingStatusRecord,ensureUniqueReview,averageRating,
} from '../data/domain.js';

test('legacy hourly rate is preserved and provisional minimum fee flagged', () => {
  const migrated=normalizeWorker({id:'x',rate:'₱300/hr'});
  assert.equal(migrated.minimumServiceFee,300);
  assert.equal(migrated.legacyRate,'₱300/hr');
  assert.equal(migrated.pricingNeedsReview,true);
  assert.equal(normalizeWorker(migrated).minimumServiceFee,300);
});
test('price parser accepts pesos and rejects negative/unparseable values',()=>{
 assert.equal(parseMoney('₱500'),500);
 assert.equal(parseMoney('250.50'),250.50);
 assert.ok(Number.isNaN(parseMoney('-12')));
 assert.ok(Number.isNaN(parseMoney('1e9')));
 assert.ok(Number.isNaN(parseMoney('abc')));
});
test('date must be real, future and have 24-hour time',()=>{
 assert.equal(validFutureDate('2026-02-30','12:00'),false);
 assert.equal(validFutureDate('1990-01-01','12:00'),false);
 assert.equal(validFutureDate('2032-11-24','14:30'),true);
 assert.equal(validFutureDate('2032-11-24','25:00'),false);
});
test('rescheduling preserves old values and rejects terminal booking states',()=>{
 const booking={id:'b1',date:'2032-10-01',time:'09:00',status:'Upcoming'};
 const next=updateScheduleRecord(booking,'2032-11-24','14:30');
 assert.equal(next.date,'2032-11-24');
 assert.equal(next.rescheduleHistory[0].oldDate,'2032-10-01');
 assert.throws(()=>updateScheduleRecord({...booking,status:'Completed'},'2032-11-24','14:30'));
});
test('allowed booking status transitions',()=>{
 assert.equal(changeBookingStatusRecord({status:'Pending'},'Upcoming').status,'Upcoming');
 assert.equal(changeBookingStatusRecord({status:'Upcoming'},'Completed').status,'Completed');
 assert.throws(()=>changeBookingStatusRecord({status:'Completed'},'Upcoming'));
 assert.throws(()=>changeBookingStatusRecord({status:'Cancelled'},'Completed'));
});
test('single rating per completed booking and correct average',()=>{
 const reviews=[{bookingId:'b1',clientId:'c1',workerId:'w1',stars:5},{bookingId:'b2',clientId:'c2',workerId:'w1',stars:3}];
 assert.throws(()=>ensureUniqueReview(reviews,'b1','c1'));
 assert.doesNotThrow(()=>ensureUniqueReview(reviews,'b3','c1'));
 assert.equal(averageRating(reviews,'w1'),4);
 assert.equal(averageRating(reviews,'w2'),null);
});
