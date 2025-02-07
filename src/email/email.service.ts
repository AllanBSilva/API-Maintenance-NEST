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
      host: 'smtp.gmail.com',  // Configuração do servidor SMTP
      port: 465,       //587 porta primeiro usada, 465 nova porta
      secure: true,  // True para 465, false para outros
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendRecoveryEmail(to: string, token: string): Promise<void> {
    // Define o URL de recuperação com o token
    const recoveryUrl = `http://localhost:3001/reset-password/${token}`;
    
    // Define as opções do e-mail
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
      // Tenta enviar o e-mail
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Aqui você pode logar ou tratar erros
      console.error('Erro ao enviar e-mail de recuperação:', error);
    }
  }
  
}
