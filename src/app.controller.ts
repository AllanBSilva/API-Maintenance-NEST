import { Controller, Get, Res } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import * as marked from 'marked';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Serve o README.md convertido em HTML' })
  @ApiResponse({ status: 200, description: 'README.md carregado e convertido com sucesso', type: String })
  @ApiResponse({ status: 500, description: 'Erro ao carregar o README.md', type: String })
  getReadme(@Res() res: Response): void {
    try {
      const readmePath = join(__dirname, '..', 'README.md');
      const readmeContent = readFileSync(readmePath, 'utf-8');
      const htmlContent = marked.parse(readmeContent);

      res.type('html');  
      res.send(htmlContent);
    } catch (error) {
      res.status(500).send('Erro ao carregar o README.md');
    }
  }
}
