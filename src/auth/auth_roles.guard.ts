import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log("======>>> this.reflector",this.reflector)
    const requiredRole = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Log the required roles
    console.log('Required Roles:', requiredRole);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    // Ensure user.role is properly set
    if (!user || !user.role) {
      console.log('User role is not set');
      return false; // Return false if no role is set
    }

    // Log the user role
    console.log('User Role:', user.role);

    // Directly compare the single user role with the required role
    return requiredRole.includes(user.role);
  }
}
