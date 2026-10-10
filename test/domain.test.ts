import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { generateDeliveryDates, adjustForDepotHoliday } from '../src/lib/domain/scheduler.ts';
import { transitionStatus, canTransition } from '../src/lib/domain/stateMachine.ts';

describe('Domain: Scheduler', () => {
  it('menghasilkan tanggal berurutan sesuai interval', () => {
    // 2026-03-02 adalah hari Senin. Interval 2: Senin, Rabu, Jumat
    const dates = generateDeliveryDates(new Date(2026, 2, 2), 2, 3);
    assert.deepEqual(dates, ['2026-03-02', '2026-03-04', '2026-03-06']);
  });

  it('menggeser hari Minggu ke hari Senin', () => {
    // 2026-03-08 adalah hari Minggu
    const sunday = new Date(2026, 2, 8);
    const adjusted = adjustForDepotHoliday(sunday);
    assert.equal(adjusted.getDay(), 1); // Senin
    assert.equal(adjusted.getDate(), 9);
  });
});

describe('Domain: Order State Machine', () => {
  it('memvalidasi alur yang diizinkan', () => {
    assert.equal(canTransition('PENDING', 'DELIVERING'), true);
    assert.equal(canTransition('DELIVERING', 'DELIVERED'), true);
    assert.equal(canTransition('PENDING', 'DELIVERED'), false);
    assert.equal(canTransition('DELIVERED', 'CANCELLED'), false);
  });

  it('menolak transisi ilegal dengan pesan error informatif', () => {
    assert.throws(() => {
      transitionStatus('PENDING', 'DELIVERED');
    }, /Transisi status ilegal/);
  });
});
