import { HttpException, HttpStatus } from '@nestjs/common';


export class Utils {
    correctDate(date: string) {
        const dateUtc = new Date(date);
        return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
      }
}