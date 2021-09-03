import { Injectable } from "@angular/core";
const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USERNAME = "username";
@Injectable({
	providedIn: "root",
})
export class TokenService {
	constructor() {}
	getToken(): string {
		return localStorage.getItem(ACCESS_TOKEN);
	}

	getRefreshToken(): string {
		return localStorage.getItem(REFRESH_TOKEN);
	}

	saveToken(token): void {
		localStorage.setItem(ACCESS_TOKEN, token);
	}

	getUserToken(): string {
		return localStorage.getItem(USERNAME);
	}
	saveUserToken(username): void {
		console.log(username, "LOCASTORGARE");
		localStorage.setItem(USERNAME, username);
	}

	saveRefreshToken(refreshToken): void {
		localStorage.setItem(REFRESH_TOKEN, refreshToken);
	}

	removeToken(): void {
		localStorage.removeItem(ACCESS_TOKEN);
	}
	removeUserToken(): void {
		localStorage.removeItem(USERNAME);
	}

	removeRefreshToken(): void {
		localStorage.removeItem(REFRESH_TOKEN);
	}
}
