import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
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
	private static handleError(error: HttpErrorResponse): any {
		if (error.error instanceof ErrorEvent) {
			console.error("An error occurred:", error.error.message);
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error.message)}`);
		}
		return throwError(error.error.message || "Something Went Wrong");
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
		//console.log("REFRESH DAtA", refreshData);
		return this.http.post<any>(API_URL + "/token", { reftoken: refreshData }, HTTP_OPTIONS).pipe(
			tap((res) => {
				this.tokenService.saveToken(res.token);
				this.tokenService.saveRefreshToken(refreshData);
			}),
			catchError(AuthService.handleError)
		);
	}

	logout(data): Observable<any> {
		return this.http.post<any>(API_URL + "/logout", data).pipe(
			tap((res) => {
				console.log(res);
				this.tokenService.removeToken();
				this.tokenService.removeRefreshToken();
				this.tokenService.removeUserToken();
				localStorage.removeItem("last_login_at");
			}),
			catchError(AuthService.handleError)
		);
	}

	register(registerData: any): Observable<any> {
		this.tokenService.removeToken();
		this.tokenService.removeRefreshToken();
		this.tokenService.removeUserToken();
		return this.http.post<any>(API_URL + "/register", JSON.stringify(registerData), HTTP_OPTIONS).pipe(catchError(AuthService.handleError));
	}
}
