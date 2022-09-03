import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = <string>req.headers["x-access-token"] || req.headers["authorization"];
    console.log('[AUTH_MIDDLEWARE token]', token);
    
    if (!token) throw new HttpException('Unauthorized, no token provided', HttpStatus.FORBIDDEN);

    // decode the token 
    try {
      const verifyResponse = this.jwtService.verify(token);
      console.log('[AUTH_MIDDLEWARE verifyResponse]', verifyResponse);
      if (verifyResponse) {
        // token verified
        const decodedToken = this.jwtService.decode(token);
        console.log('[AUTH_MIDDLEWARE decodedToken]', decodedToken);
        if (decodedToken) {
          req.user = decodedToken;
          next();
        } else {
          throw new HttpException('Unauthorized, token authentication failed', HttpStatus.FORBIDDEN);
        }
      }
    } catch (error) {
      throw new HttpException('Unauthorized, token authentication failed', HttpStatus.FORBIDDEN);
    }
  }
}