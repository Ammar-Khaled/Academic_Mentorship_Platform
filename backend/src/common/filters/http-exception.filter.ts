import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export class ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapter: any) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let status: number;
    let message: string | string[];
    let error: string;
    let details: any = undefined;

    const path = request.url;
    const timestamp = new Date().toISOString();

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();

      if (typeof responseData === 'object' && responseData !== null) {
        const exceptionData = responseData as any;
        message = exceptionData.message || exception.message;
        error = exceptionData.error || HttpStatus[status];
        details = exceptionData.details;
      } else {
        message = exception.message;
        error = HttpStatus[status];
      }

      this.logger.warn(
        `${request.method} ${path} - ${status} - ${error}: ${
          Array.isArray(message) ? message.join(', ') : message
        }`,
      );
    } else if (exception instanceof Error) {
      // Handle unhandled errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = 'Internal Server Error';

      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      error = 'Internal Server Error';

      this.logger.error(
        `Unknown exception type: ${typeof exception}`,
        exception,
      );
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp,
      path,
      ...(details && { details }),
    };

    this.httpAdapter.reply(response, errorResponse, status);
  }
}
