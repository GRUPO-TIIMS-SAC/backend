import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TmpValidatedEmail } from 'src/entities_tmp/tmp_validated_email.entity';
import { Repository } from 'typeorm';
import { SendEmailDto } from './dto/sendEmail.dto';
import { CreateTmpValidatedEmailDto } from './dto/createTmpValidatedEmail.dto';
import { SendEmailService } from 'src/send_email/send_email.service';
import { json } from 'stream/consumers';
import { StringifyOptions } from 'querystring';

@Injectable()
export class TmpValidatedEmailService {
  constructor(
    @InjectRepository(TmpValidatedEmail)
    private readonly tmpValidatedEmailRepository: Repository<TmpValidatedEmail>,
    private readonly sendEmailService: SendEmailService,
  ) {}

  private generateRandomCode(): string {
    const codeLength = 6;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  async sendValidatedEmail(email: SendEmailDto) {
    const emailExists = await this.tmpValidatedEmailRepository.findOne({
      where: {
        email: email.email,
      },
    });

    const code = this.generateRandomCode();
    const idEmail = await this.sendEmail(email.email, code);
    let jsonEmail = {
      id: 'without-id',
    };

    if (idEmail instanceof HttpException) {
      return idEmail;
    } else {
      jsonEmail = JSON.parse(JSON.stringify(idEmail));
    }

    if (emailExists) {
      const updateTmp = Object.assign(emailExists, {
        code: code,
        email_id: jsonEmail.id,
        updated_at: new Date(),
      });
      return this.tmpValidatedEmailRepository.save(updateTmp);
    }

    const tmpValidatedEmailBody: CreateTmpValidatedEmailDto = {
      email: email.email,
      code: this.generateRandomCode(),
      email_id: jsonEmail.id,
    };

    const newTmpValidatedEmail = this.tmpValidatedEmailRepository.create(
      tmpValidatedEmailBody,
    );
    return this.tmpValidatedEmailRepository.save(newTmpValidatedEmail);
  }

  private async sendEmail(email: string, code: string) {
    try {
      const data = await this.sendEmailService.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Código de verificación',
        html: `
        <h1 style='text-center'>Código de verificación</h1>
        <div style='width:255px; height: 55px; background-color: #FF7F50'>
            <p style='color: white'>El código de verificación es: <strong>${code}</strong></p>
        </div>
        `,
      });

      return data;
    } catch (e) {
      return new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
