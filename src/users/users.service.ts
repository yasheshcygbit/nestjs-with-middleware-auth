import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetAccessTokenDto } from './dto/get-access-token.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // first find the user
    try {
      const responseFind = await this.userRepository.findOne({
        where: [
          {
            email: loginDto.email
          }
        ]
      })
      if (responseFind && responseFind.password === loginDto.password) {
        // user is authenticated
        return this.generateTokens({...responseFind});
      } else {
        throw 'PASSWORD_DONT_MATCH';
      }
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    // first find the user
    try {
      const responseFind = await this.userRepository.findOne({
        where: [
          {
            email: registerDto.email
          }
        ]
      })
      console.log('[RESP_CREATE responseFind]', responseFind);
      if (responseFind) {
        // user is authenticated
        throw 'USER_ALREADY_EXISTS';
      } else {
        // create user
        const responseCreate = this.userRepository.create({ email: registerDto.email, password: registerDto.password })
        const finalResp = await this.userRepository.save(responseCreate);
        console.log('[RESP_CREATE finalResp]', finalResp);
        return this.generateTokens({...finalResp});
      }
    } catch (error) {
      console.log('[RESP_CREATE error]', error);
      // throw error;
      if (error === 'USER_ALREADY_EXISTS') {
        throw new HttpException('User already exists', 403);
      }
      throw new HttpException('Internal server errors', 500);
    }
  }

  generateTokens(payload: any) {
    return {
      user: payload,
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '30s'
      }),
      refreshToken: this.jwtService.sign(payload)
    }
  }

  generateAccessToken(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '30s'
      })
    }
  }

  async getUserDetailsById(id: string, user: AuthUserDto) {
    try {
      console.log('[USER user]', user);
      return id;
    } catch (error) {
      
    }
  }

  async getAccessToken(gatDto: GetAccessTokenDto) {
    try {
      // first verify the refresh token and get user info. If it is valid send new access token
      const verifyResponse = this.jwtService.verify(gatDto.refreshToken);
      console.log('[AUTH_MIDDLEWARE verifyResponse]', verifyResponse);
      if (verifyResponse) {
        // token verified
        const decodedToken = <AuthUserDto>this.jwtService.decode(gatDto.refreshToken);
        console.log('[AUTH_MIDDLEWARE decodedToken]', decodedToken);
        if (decodedToken) {
          // generate new accessToken
          return this.generateAccessToken({email: decodedToken.email, id: decodedToken.email})
        } else {
          throw new HttpException('Unauthorized, token authentication failed', HttpStatus.FORBIDDEN);
        }
      } else {
        throw new HttpException('Unauthorized, refresh token authentication failed', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Unauthorized, refresh token authentication failed', HttpStatus.FORBIDDEN);
    }
  }

}
