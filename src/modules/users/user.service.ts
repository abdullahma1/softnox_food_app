import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'argon2'; // Using bcrypt alternative

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Find a user by username
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findRole(id: any): Promise<User> {
    return this.userRepository.findOne({ where: { id }, select: ['id', 'username', 'email', 'role'] });
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email is already in use
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password);

    // Create user entity
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role, // Ensure `roles` matches the enum array structure
    });

    // Save user to the database
    return this.userRepository.save(newUser);
  }
}















// import { Injectable, ConflictException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // Find a user by username
//   async findOne(username: string): Promise<User | undefined> {
//     const user = this.userRepository.findOne({ where: { username } });
//     console.log("===================",user)
//     return user
//   }

//   // Create a new user
//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const { username, password,email, roles } = createUserDto;

//     // Check if user already exists
//     const existingUser = await this.findOne(email);
//     if (existingUser) {
//       throw new ConflictException('Username already exists');
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user entity
//     const newUser = this.userRepository.create({
//       username,
//       email,
//       password: hashedPassword,
//       roles,
//     });

//     // Save user to the database
//     return this.userRepository.save(newUser);
//   }
// }