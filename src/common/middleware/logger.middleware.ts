import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private logger = new Logger(LoggerMiddleware.name);
  
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(
        `[${method}] ${originalUrl} ${statusCode} - ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
