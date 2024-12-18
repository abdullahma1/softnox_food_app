import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth_jwt.strategy';
import { UserModule } from '../modules/users/user.module';
import { LocalStrategy } from './local.strategy'; 
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'bcvzxbcvzxnbcmvzxbnc', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy , LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

