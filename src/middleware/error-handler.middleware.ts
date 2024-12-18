import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;
      if (statusCode >= 400) {
        console.error(`Error occurred: ${statusCode} ${res.statusMessage}`);
      }
    });

    try {
      next();
    } catch (error) {
      console.error('Error intercepted in middleware:', error.message);

      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: error.message || 'Internal server error',
      });
    }
  }
}
