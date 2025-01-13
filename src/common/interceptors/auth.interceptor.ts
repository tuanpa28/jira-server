import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenExpiredException } from '../guards';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TokenExpiredException) {
          const res = context.switchToHttp().getResponse();
          res.setHeader('X-Refresh-Token-Required', 'true');
          res.status(HttpStatus.UNAUTHORIZED).json({
            message: 'Token expired',
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
