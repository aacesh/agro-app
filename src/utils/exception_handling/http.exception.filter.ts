
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseModel } from 'src/models/response.model';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const messages= exception.getResponse()['message'];
    // console.log("messages:", messages)
    const errorType= exception.getResponse()['error'];
    let res:  ResponseModel ={
      statuscode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      error: true,
      messages,
      errorType

    }

    // response
    //   .status(status)
    //   .json({
    //     statusCode: status,
    //     timestamp: new Date().toISOString(),
    //     // path: request.url,
    //     error: true,
    //     messages,
    //     errorType
    //   });
      response
      .status(status)
      .json(res);
  }
}
