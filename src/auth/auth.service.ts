import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/users/user.service';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ username, password }: any) {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    
    
    const isMatch = await argon2.verify(user.password.trim(), password.trim()); 
    console.log(isMatch)
    if (isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    console.log('User validated:', user);

    const { password: _, ...userData } = user;
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const { username, email, password, role } = userData;

    const existingUser = await this.userService.findOne(username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const existingUserByEmail = await this.userService.findOne(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

  // Higher salt rounds
  console.log("reg",password)
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = await argon2.hash(password.trim());

    const newUser = await this.userService.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    console.log('New user registered:', newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }
}









// import { Injectable,ConflictException, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../modules/users/user.service';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser({ username, password }: any) {
//     console.log("main andar aggyaa")
//     // const findUser = await this.userService.findOne(username);
//     const user = await this.userService.findOne(username);
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("bcrypt compare result:", isMatch);
//     try {
//       console.log("main bcrypt b hogyaaa")
//       const { password, ...result } = user;
//       return this.jwtService.sign(result);
//     }
//     catch (error){
//       console.log(error)
//     }
//     }


//   async login(user: any) {
//     const payload = { email: user.email, sub: user.id, roles: user.roles };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
  
//   async register(userData: any) {
//     console.log("=======> data",userData)
//     const { username, email, password , roles } = userData;

//     // Check if the user already exists
//     const existingUser = await this.userService.findOne(username);
//     if (existingUser) {
//       throw new ConflictException('User already exists');
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);


//     // Create the user
//     const newUser = await this.userService.create({
//       username,
//       email,
//       password: hashedPassword,
//       roles
//     });

//     return {
//       user: {
//         id: newUser.id,
//         username: newUser.username,
//         email: newUser.email,
//       },
//     };
//   }
// }

