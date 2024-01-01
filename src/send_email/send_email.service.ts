import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SendEmailService {
    constructor(){

    }

    async send(body:{from: string, to: string, subject: string, html: string}) {
        const url = 'https://api.resend.com/emails';
        const apiKey = process.env.RESEND_API_KEY;
    
        const data = {
          from: body.from,
          to: body.to,
          subject: body.subject,
          html: body.html,
        };
    
        const headers = {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
    
        try {
          const response = await axios.post(url, data, { headers });
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error(error);
          return error;
        }
      }
}
