export interface JwtPayload {
    sub: string; // User ID
    username: string;
    roles: string[]; // Array of roles
  }
  