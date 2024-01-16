import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendEmailService {
    constructor( private readonly mailerService: MailerService ){}

    async send(body:{from: string, to: string, subject: string, html: string}){
      try {
        const respEmail = await this.mailerService.sendMail({
          to: body.to,
          subject: body.subject,
          html: body.html,
        })
        console.log(respEmail.messageId);
        return respEmail;
      } catch (error) {
        return new HttpException(error, HttpStatus.BAD_REQUEST)
      }
      
    }
}
