import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config  from './utils/config'
import { GlobalExceptionFilter } from './utils/exception_handling/http.exception.catch.filter';
import { HttpExceptionFilter } from './utils/exception_handling/http.exception.filter';
import * as cookieParser from 'cookie-parser';
import swagger from './utils/docs/swagger'

require("dotenv").config()

async function bootstrap() {
  Logger.log("NODE ENV: " + process.env.NODE_ENV)
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalFilters(new HttpExceptionFilter());
  
  console.log("config: ")
  console.log(config)
  app.setGlobalPrefix('api/v1')
  swagger(app)
  await app.listen("3000");
}
bootstrap();
