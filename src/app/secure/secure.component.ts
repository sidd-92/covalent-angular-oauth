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
  user: any = {};

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoadingResults = true;
    let userToken = this.tokenService.getUserToken();
    this.userService.getUserDetails(userToken).subscribe((userData) => {
      this.isLoadingResults = false;
      console.log(userData, "USER DATA");
      this.user = userData;
    });
  }

  logout(): void {
    let reftoken = this.tokenService.getRefreshToken();
    let userToken = this.tokenService.getUserToken();
    this.userService
      .getUserDetails(userToken)
      .subscribe((userDetailData: any) => {
        console.log("USER DETAIL DATA", userDetailData);
        this.authService.logout(reftoken).subscribe((logoutData: any) => {
          console.log(logoutData);
          let lastLoginAt = new Date(userDetailData["last_login_at"]);
          var thisTime = new Date(); // now
          var diff = thisTime.getTime() - lastLoginAt.getTime(); // now - Feb 1
          var totalElapsedTime = Math.ceil(diff / (1000 * 60 * 60 * 24));

          console.log(totalElapsedTime, "TOTAL TIME LAPSED"); // positive number of days
          this.userService
            .logUser({
              username: userToken,
              last_login_at: userDetailData["last_login_at"],
              session_duration: diff,
              loggedIn: false,
            })
            .subscribe((data) => {
              console.log(data);
              this.router
                .navigate(["/login"])
                .then((_) => console.log("Logout"));
            });
        });
      });
  }
}
