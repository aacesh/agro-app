
// import {
//     ExceptionFilter,
//     Catch,
//     ArgumentsHost,
//     HttpException,
//     HttpStatus,
//   } from '@nestjs/common';
//   import { HttpAdapterHost } from '@nestjs/core';
// import { ResponseModal } from 'src/models/response.model';

//   @Catch()
//   export class AllExceptionsFilter implements ExceptionFilter {
//     constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

//     catch(exception: unknown, host: ArgumentsHost): void {
//       // In certain situations `httpAdapter` might not be available in the
//       // constructor method, thus we should resolve it here.
//       const { httpAdapter } = this.httpAdapterHost;

//       const ctx = host.switchToHttp();

//       const httpStatus =
//         exception instanceof HttpException
//           ? exception.getStatus()
//           : HttpStatus.INTERNAL_SERVER_ERROR;

//       const responseBody = {
//         statusCode: httpStatus,
//         timestamp: new Date().toISOString(),
//         path: httpAdapter.getRequestUrl(ctx.getRequest()),
//       };


//       const type= httpAdapter.getType()
//       console.log('type;', type)
//       const test= ctx.getResponse()
//       console.log('test;', test)
//     // console.log("messages:", messages)
//     // const errorType= exception.getResponse()['error'];

//     //   let res:  ResponseModal ={
//     //     statuscode: httpStatus,
//     //     timestamp: new Date().toISOString(),
//     //     // path: request.url,
//     //     error: true,
//     //     messages,
//     //     errorType

//     //   }

//       httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//     }
//   }



import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseModel } from 'src/models/response.model';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string | string[] => {

  // if (exception instanceof HttpException) {
  //   console.log("Instance of http exception")
  //   console.log(exception['response'])
  //   if (exception['response']) {
  //     console.log("exception response:", exception['response'])
  //     return exception['response'].message
  //   }
  //   return exception.message
  // }
  // return String(exception)

  return exception instanceof HttpException
    ? exception["response"] ? exception["response"].message
      : exception.message
    : String(exception)
};


export const getErrorType = (exception: unknown): string => {
  return exception instanceof HttpException
    ? exception.name
    : 'Internal Server Error';
};



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('exception;', exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const code = getStatusCode(exception);
    const messages = getErrorMessage(exception);
    const errorType = getErrorType(exception);

    let res: ResponseModel = {
      statuscode: code,
      timestamp: new Date().toISOString(),
      // path: request.url,
      error: true,
      messages,
      errorType

    }
    response.status(code).json(res);
  }
}