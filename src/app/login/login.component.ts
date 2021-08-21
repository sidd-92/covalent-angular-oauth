import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { ErrorStateMatcher } from "@angular/material/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../user.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username = "";
  password = "";
  isLoadingResults = false;
  serverError = false;
  serverErrorMessage = "";
  matcher = new MyErrorStateMatcher();
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  onFormSubmit(): void {
    console.log("FORM SUBMITTED", this.loginForm.value);
    this.isLoadingResults = true;
    this.authService.login(this.loginForm.value).subscribe(
      () => {
        this.isLoadingResults = false;
        this.serverError = false;
        this.userService
          .logUser({
            username: this.loginForm.value.username,
            last_login_at: new Date().toISOString(),
            session_duration: 0,
            loggedIn: true,
          })
          .subscribe((data) => {
            console.log(data);
            this.router
              .navigate(["/secure"])
              .then((_) => console.log("You are secure now!"));
          });
      },
      (err: any) => {
        this.serverError = true;
        this.serverErrorMessage = err;
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }
}
