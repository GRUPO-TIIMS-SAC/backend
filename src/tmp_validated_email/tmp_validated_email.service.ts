import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TmpValidatedEmail } from 'src/entities_tmp/tmp_validated_email.entity';
import { Repository } from 'typeorm';
import { SendEmailDto } from './dto/sendEmail.dto';
import { CreateTmpValidatedEmailDto } from './dto/createTmpValidatedEmail.dto';
import { SendEmailService } from 'src/send_email/send_email.service';
import { ValidatedCodeDto } from './dto/validated-code.dto';
import { generateHtml } from 'src/send_email/email_template';

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
      console.log(idEmail);
      jsonEmail.id = JSON.parse(JSON.stringify(idEmail)).messageId;
    }

    if (emailExists) {
      const updateTmp = Object.assign(emailExists, {
        code: code,
        email_id: jsonEmail.id,
        updated_at: new Date(),
      });

      const respData = await this.tmpValidatedEmailRepository.save(updateTmp);
      return new HttpException(
        { message: 'Email resent', data: respData },
        HttpStatus.OK,
      );
    }

    const tmpValidatedEmailBody: CreateTmpValidatedEmailDto = {
      email: email.email,
      code: this.generateRandomCode(),
      email_id: jsonEmail.id,
    };

    const newTmpValidatedEmail = this.tmpValidatedEmailRepository.create(
      tmpValidatedEmailBody,
    );
    const respData =
      await this.tmpValidatedEmailRepository.save(newTmpValidatedEmail);
    return new HttpException(
      { message: 'Email sent', data: respData },
      HttpStatus.OK,
    );
  }

  private async sendEmail(email: string, code: string) {
    try {
      const data = await this.sendEmailService.send({
        to: email,
        subject: 'Código de verificación',
        html: generateHtml(code),
      });
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async testRespprev() {
    const status = HttpStatus.OK;
    return new HttpException({ message: 'Error', status: status }, status);
  }

  async testResp() {
    return (await this.testRespprev()).getResponse();
  }

  private correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  async validateCode(body: ValidatedCodeDto) {
    const email = await this.tmpValidatedEmailRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!email) {
      return new HttpException(
        'Email not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fifteenMinutes = 15 * 60 * 1000; // 15 minutos en milisegundos
    const updatedDate = new Date(email.updated_at).getTime();

    if (new Date().getTime() - updatedDate >= fifteenMinutes) {
      return new HttpException(
        'Code expired',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (email.code !== body.code) {
      return new HttpException(
        'Invalid code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updateTmp = Object.assign(email, {
      attempts: email.attempts + 1,
    });

    return this.tmpValidatedEmailRepository.save(updateTmp);
  }

  async getOneTmpValidatedEmail(email: string) {
    const exists = await this.tmpValidatedEmailRepository.findOne({
      where: {
        email: email,
      },
    });

    return exists;
  }

  async deleteTmpValidatedEmail(email: string) {
    const result = await this.tmpValidatedEmailRepository.delete({ email });

    if (result.affected === 0) {
      return new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    return new HttpException(
      `${result.affected} emails deleted`,
      HttpStatus.OK,
    );
  }
}
