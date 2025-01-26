import { Controller, Get, Res } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import * as marked from 'marked';
import { ApiOperation, ApiResponse } from '@nestjs/swagger'; // Importando as anotações do Swagger

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Serve o README.md convertido em HTML' }) // Descrição da operação
  @ApiResponse({ status: 200, description: 'README.md carregado e convertido com sucesso', type: String }) // Resposta esperada
  @ApiResponse({ status: 500, description: 'Erro ao carregar o README.md', type: String }) // Caso ocorra um erro
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
