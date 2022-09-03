import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  renderHome(@Query('message') message: string): any {
    return { title: 'Home', paramMessage: message }
  }
}
