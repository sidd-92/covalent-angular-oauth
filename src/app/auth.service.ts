import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
const API_URL = "http://localhost:3000/api/user";
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  redirectUrl = "";
  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error.message)}`
      );
    }
    return throwError(error.error.message || "Something Went Wrong");
  }

  private static log(message: string): any {
    console.log(message);
  }
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(loginData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    let un = loginData.username;
    return this.http
      .post<any>(
        API_URL + "/login",
        JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
        HTTP_OPTIONS
      )
      .pipe(
        tap((res) => {
          this.tokenService.saveToken(res.token);
          this.tokenService.saveRefreshToken(res.refreshToken);
          this.tokenService.saveUserToken(un);
        }),
        catchError(AuthService.handleError)
      );
  }

  refreshToken(refreshData: any): Observable<any> {
    // this.tokenService.removeToken();
    //this.tokenService.removeRefreshToken();
    console.log("REFRESH DAtA", refreshData);
    return this.http
      .post<any>(API_URL + "/token", { reftoken: refreshData }, HTTP_OPTIONS)
      .pipe(
        tap((res) => {
          this.tokenService.saveToken(res.token);
          this.tokenService.saveRefreshToken(refreshData);
        }),
        catchError(AuthService.handleError)
      );
  }

  logout(refreshData: any): Observable<any> {
    console.log("REFRESH", refreshData);
    return this.http
      .post<any>(API_URL + "/logout", { reftoken: refreshData }, HTTP_OPTIONS)
      .pipe(
        tap((res) => {
          console.log(res);
          this.tokenService.removeToken();
          this.tokenService.removeRefreshToken();
          this.tokenService.removeUserToken();
        }),
        catchError(AuthService.handleError)
      );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(API_URL + "oauth/signup", data).pipe(
      tap((_) => AuthService.log("register")),
      catchError(AuthService.handleError)
    );
  }

  secured(): Observable<any> {
    return this.http
      .get<any>(API_URL + "/secret", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.tokenService.getToken()}`,
        }),
      })
      .pipe(catchError(AuthService.handleError));
  }
}
