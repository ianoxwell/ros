// logger/logger.service.ts
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;
  private buffer = Buffer.from(process.env.SERVICE_ACCOUNT, 'base64');
  private loggingWinston = new LoggingWinston({
    projectId: 'recipeorderingsimplified',
    credentials: JSON.parse(this.buffer.toString('ascii'))
  });

  constructor() {
    this.logger = winston.createLogger({
      level: 'warn',
      defaultMeta: {
        service: 'ros-api',
        environment: process.env.ENVIRONMENT || 'PROD'
      },
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        }),
        this.loggingWinston
      ]
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}
