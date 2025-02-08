// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,     
      secure: true,  
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendRecoveryEmail(to: string, token: string): Promise<void> {
    const recoveryUrl = `http://localhost:3001/reset-password/${token}`;
    
    const mailOptions = {
      from: 'noreply@mail.com', 
      to,
      subject: 'Recuperação de Senha',
      text: `
        Olá,
  
        Recebemos uma solicitação de recuperação de senha para sua conta. 
        Se você não fez essa solicitação, por favor, ignore este e-mail.
  
        Para recuperar sua senha, clique no link abaixo:
        
        Token de recuperação: ${token}
        
        Link para recuperação: ${recoveryUrl}
        
        Caso o link não funcione, copie e cole o endereço acima na barra de endereços do seu navegador.
        
        Atenciosamente,
        Equipe.
      `, 
      html: `
        <p>Olá,</p>
        <p>Recebemos uma solicitação de recuperação de senha para sua conta.</p>
        <p><strong>Se você não fez essa solicitação, por favor, ignore este e-mail.</strong></p>
        <p>Para recuperar sua senha, clique no link abaixo:</p>
        <p><a href="${recoveryUrl}">${recoveryUrl}</a></p>
        <p><strong>Token de recuperação: ${token}</strong></p>
        <p>Caso o link não funcione, copie e cole o endereço acima na barra de endereços do seu navegador.</p>
        <p>Atenciosamente,<br/>Equipe.</p>
      `,
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Erro ao enviar e-mail de recuperação');
    }
  }
  
}
