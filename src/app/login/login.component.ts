import { Component, OnInit, TemplateRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "../auth.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "../user.service";
import { filter } from "rxjs/operators";
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from "@aws-amplify/ui-components";
import Amplify, { Auth, Hub } from "aws-amplify";
import { ITdDynamicElementConfig, TdDynamicElement, TdDynamicType, TdDynamicFormsComponent } from "@covalent/dynamic-forms";
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
	@ViewChild("loginForm", { static: true }) loginForm: TdDynamicFormsComponent;
	loginElements: ITdDynamicElementConfig[] = [
		{
			name: "username",
			label: "User Name",
			type: TdDynamicElement.Input,
			required: true,
			validators: [
				{
					validator: Validators.required,
				},
			],
			flex: 50,
		},

		{
			name: "password",
			label: "Password",
			type: TdDynamicElement.Password,
			required: true,
			validators: [
				{
					validator: Validators.required,
				},
			],
			flex: 50,
		},
	];
	username = "";
	password = "";
	sessionExpired = "";
	isLoadingResults = false;
	serverError = false;
	serverErrorMessage = "";
	matcher = new MyErrorStateMatcher();
	title = "amplify-angular-auth";
	formFields = [];
	federated = {
		googleClientId: "149652306515-t16umlu48imhdt8as6iis101pe2kr5qc.apps.googleusercontent.com", // Enter your googleClientId here
	};
	user: CognitoUserInterface | undefined;
	authState: AuthState;
	constructor(
		private cdRef: ChangeDetectorRef,
		private authService: AuthService,
		private router: Router,
		private formBuilder: FormBuilder,
		private userService: UserService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			if (params.username) {
				this.username = params.username;
			}
			if (params.error) {
				this.sessionExpired = "Session Has Expired, Please Login Again";
			}
			this.cdRef.detectChanges();
		});
		onAuthUIStateChange((authState, authData) => {
			this.authState = authState;
			this.user = authData as CognitoUserInterface;
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy() {
		return onAuthUIStateChange;
	}

	submitManualValidator(): void {
		console.log(this.loginForm.controls["username"].value);
		let loginData = {
			username: this.loginForm.controls["username"].value,
			password: this.loginForm.controls["password"].value,
		};
		this.authService.login(loginData).subscribe(
			() => {
				this.isLoadingResults = false;
				this.serverError = false;
				this.userService
					.logUser({
						username: this.loginForm.controls["username"].value,
						last_login_at: new Date().toISOString(),
						session_duration: 0,
						loggedIn: true,
					})
					.subscribe((data) => {
						console.log(data);
						this.router.navigate(["/secure"]).then((_) => console.log("You are secure now!"));
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
						this.router.navigate(["/secure"]).then((_) => console.log("You are secure now!"));
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
