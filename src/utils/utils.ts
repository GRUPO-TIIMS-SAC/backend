import { HttpException, HttpStatus } from '@nestjs/common';
import { env } from 'process';

export class Utils {
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  route() {
    const production = true;
    if (production) {
      return 'https://apitest.tiims.com.pe';
    } else {
      return 'http://localhost:4000';
    }
  }
}
