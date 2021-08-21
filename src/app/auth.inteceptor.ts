import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { TokenService } from "./token.service";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer " + token,
        },
        headers: request.headers.set("Accept", "application/json"),
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log("event--->>>", event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error.error.message, "SOME ERROR");
        if (error.status === 403 && error.error.type === "reftoken") {
          this.tokenService.removeToken();
          this.tokenService.removeRefreshToken();
          this.tokenService.removeUserToken();
          this.router
            .navigate(["login"])
            .then((_) => console.log("redirect to login"));
        } else {
          if (error.status === 401) {
            if (error.error.err === "jwt expired") {
              this.authService.refreshToken(refreshToken).subscribe(() => {
                location.reload();
              });
            } else {
              this.tokenService.removeToken();
              this.tokenService.removeRefreshToken();
              this.tokenService.removeUserToken();
              this.router
                .navigate(["login"])
                .then((_) => console.log("redirect to login"));
            }
          }
        }
        return throwError(error);
      })
    );
  }
}
