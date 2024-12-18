import { Body, Controller, Get, Post, Req, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req) {
      console.log(req.body)
      return this.authService.login(req.body)
    
    }

  @Post('register')
  async register(@Request() req) {
    console.log(req.body)
    return this.authService.register(req.body);
  }
}

