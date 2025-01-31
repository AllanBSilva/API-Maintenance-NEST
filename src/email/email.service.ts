// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // Configuração do servidor SMTP
      port: 587,
      secure: false,  // True para 465, false para outros
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendRecoveryEmail(to: string, token: string): Promise<void> {
    const recoveryUrl = `http://localhost:3000/users/reset-password?token=${token}`;
  
    const mailOptions = {
      from: 'noreply@mail.com', 
      to,
      subject: 'Recuperação de Senha',
      text: `Clique no link abaixo para recuperar sua senha:\n\n${recoveryUrl}`, 
      html: `<p>Clique no link abaixo para recuperar sua senha:</p><p><a href="${recoveryUrl}">${recoveryUrl}</a></p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
    }
  }
}
