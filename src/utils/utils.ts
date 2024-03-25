import { HttpException, HttpStatus } from '@nestjs/common';
import { env } from 'process';

export class Utils {
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  calculateAge(birthDate: Date) {
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  route() {
    const production = true;
    if (production) {
      return process.env.ROUTE;
    } else {
      return 'http://localhost:4000';
    }
  }
}
