import bcrypt from 'bcrypt';

import { randomInt } from 'crypto';

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export const hashOtp = (otp: string) => bcrypt.hash(otp, 10);

export const compareOtp = (otp: string, hash: string) =>
  bcrypt.compare(otp, hash);
