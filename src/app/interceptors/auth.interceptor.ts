import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    request.headers.append('Content-Type', 'application/json');
    request.headers.append('Authorization', 'Bearer ' + authToken);

    const authRequest = request.clone({
      headers: request.headers.append('Content-Type', 'application/json').append('Authorization', 'Bearer ' + authToken),
    });
    return next.handle(authRequest);
  }
}
