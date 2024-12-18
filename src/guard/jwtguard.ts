import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service'; // import your AuthService
import { JwtPayload } from './interface/jwt-payload.interface'; // define interface for your payload
import { UserService } from '../modules/users/user.service'; // import your UserService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'bcvzxbcvzxnbcmvzxbnc', // use the same secret key as in your AuthService
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, username } = payload;
    const user = await this.userService.findRole(sub); // Fetch user by sub (user ID)
    
    if (!user) {
      throw new UnauthorizedException();
    }

    // Ensure that the role field is attached to the user object
    const { password, ...userWithoutPassword } = user; // Remove password field (for security)
    
    return { user: { ...userWithoutPassword, role: user.role } }; // Attach the role field to the user
  }
}
