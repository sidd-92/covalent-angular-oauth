import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { TokenService } from "../token.service";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-secure",
	templateUrl: "./secure.component.html",
	styleUrls: ["./secure.component.scss"],
})
export class SecureComponent implements OnInit {
	message = "";
	isLoadingResults = false;
	color = "primary";
	user: any = {};

	constructor(private authService: AuthService, private tokenService: TokenService, private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		this.isLoadingResults = true;
		let userToken = this.tokenService.getUserToken();
		this.userService.getUserDetails(userToken).subscribe((userData) => {
			this.isLoadingResults = false;
			console.log(userData, "USER DATA");
			if (userData["role"] === "Admin") {
				this.color = "accent";
			} else {
				this.color = "primary";
			}
			this.user = userData;
			localStorage.setItem("last_login_at", userData["last_login_at"]);
		});
	}

	logout(): void {
		let userToken = this.tokenService.getUserToken(); //username
		let lastLoginAt = new Date(localStorage.getItem("last_login_at"));
		var thisTime = new Date(); // now
		var diff = thisTime.getTime() - lastLoginAt.getTime(); // now - Feb 1
		var totalElapsedTime = Math.ceil(diff / (1000 * 60 * 60 * 24));
		this.authService
			.logout({
				username: userToken,
				last_login_at: lastLoginAt,
				session_duration: diff,
			})
			.subscribe((logoutData: any) => {
				console.log(logoutData);
				this.router.navigate([`/login`]).then((_) => console.log("Logout Successfull"));
			});
	}
}
