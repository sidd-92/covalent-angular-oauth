import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { TokenService } from "./token.service";

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
const API_URL = "http://localhost:3000/api/user";
const HTTP_OPTIONS = {
	headers: new HttpHeaders({
		"Content-Type": "application/json",
	}),
};
@Injectable({
	providedIn: "root",
})
export class UserService {
	redirectUrl = "";
	private static handleError(error: HttpErrorResponse): any {
		if (error.error instanceof ErrorEvent) {
			console.error("An error occurred:", error.error.message);
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error.message)}`);
		}
		return throwError(error.error.message || "Something Went Wrong");
	}
	constructor(private http: HttpClient, private tokenService: TokenService) {}
	getUserDetails(username): Observable<any> {
		return this.http
			.get<any>(API_URL + `/all/${username}`, {
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.tokenService.getToken()}`,
				}),
			})
			.pipe(catchError(UserService.handleError));
	}

	logUser(userObject): Observable<any> {
		return this.http.post<any>(API_URL + "/log", userObject, HTTP_OPTIONS).pipe(catchError(UserService.handleError));
	}
}
