import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { hashPassword, verifyPassword } from '../src/lib/password.ts';
import { signToken, verifyToken } from '../src/lib/session.ts';

describe('Auth: Password Hashing (scrypt)', () => {
  it('berhasil melakukan hash dan verifikasi kata sandi yang cocok', () => {
    const raw = 'rahasia123';
    const hash = hashPassword(raw);

    assert.notEqual(raw, hash);
    assert.equal(verifyPassword(raw, hash), true);
  });

  it('menolak kata sandi yang salah', () => {
    const raw = 'owner123';
    const hash = hashPassword(raw);

    assert.equal(verifyPassword('salah123', hash), false);
  });
});

describe('Auth: Session Token (Web Crypto HMAC-SHA256)', () => {
  it('membuat dan memverifikasi token sesi valid', async () => {
    const payload = {
      userId: 'usr-123',
      name: 'Budi Kurir',
      email: 'kurir@kanggalon.id',
      role: 'COURIER' as const,
    };

    const token = await signToken(payload);
    assert.ok(token.includes('.'));

    const verified = await verifyToken(token);
    assert.ok(verified !== null);
    assert.equal(verified?.email, 'kurir@kanggalon.id');
    assert.equal(verified?.role, 'COURIER');
  });

  it('menolak token yang dimanipulasi', async () => {
    const token = await signToken({
      userId: 'usr-456',
      name: 'Owner',
      email: 'owner@kanggalon.id',
      role: 'OWNER' as const,
    });

    const tampered = token.replace(/a/g, 'b');
    const verified = await verifyToken(tampered);
    assert.equal(verified, null);
  });
});
