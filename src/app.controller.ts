import { Controller, Get, Res } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import * as marked from 'marked';

@Controller()
export class AppController {
  @Get()
  getReadme(@Res() res: Response): void {
    try {
      const readmePath = join(__dirname, '..', 'README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');
      
      // Converte o conteúdo Markdown para HTML
      const htmlContent = marked.parse(readmeContent);

      res.type('html');  // Especificando que o retorno é HTML
      res.send(htmlContent);
    } catch (error) {
      res.status(500).send('Erro ao carregar o README.md');
    }
  }
}
