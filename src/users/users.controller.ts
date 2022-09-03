import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetAccessTokenDto } from './dto/get-access-token.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('getAccessToken')
  async getAccessToken(@Body() gatDto: GetAccessTokenDto) {
    return this.userService.getAccessToken(gatDto);
  }

  @Get(':id')
  async getUserDetailsById(@AuthUser() user: AuthUserDto, @Param('id') id: string) {
    return this.userService.getUserDetailsById(id, user);
  }
}
