import { Component, TemplateRef, OnInit, ViewChild } from "@angular/core";
import { ErrorStateMatcher } from "@angular/material/core";

import { ITdDynamicElementConfig, TdDynamicElement, TdDynamicType, TdDynamicFormsComponent } from "@covalent/dynamic-forms";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
	@ViewChild("idForm", { static: true }) idForm: TdDynamicFormsComponent;
	textElements: ITdDynamicElementConfig[] = [
		{
			name: "firstname",
			label: "First Name",
			type: TdDynamicElement.Input,
			required: true,
			validators: [
				{
					validator: Validators.pattern(/^([a-z]*)$/),
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 4 && control.value.length <= 20;
						return !isValid ? { reqLen: true } : undefined;
					},
				},
			],
			flex: 50,
		},
		{
			name: "lastname",
			label: "Last Name",
			type: TdDynamicElement.Input,
			required: true,
			validators: [
				{
					validator: Validators.pattern(/^([a-z]*)$/),
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 4 && control.value.length <= 20;
						return !isValid ? { reqLen: true } : undefined;
					},
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
					validator: (control: AbstractControl) => {
						const isValid: boolean = /\d/i.test(control.value);
						return !isValid ? { oneNumber: true } : undefined;
					},
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 4 && control.value.length <= 20;
						return !isValid ? { length: true } : undefined;
					},
				},
				{
					validator: (control: AbstractControl) => {
						const validCharacters: string[] = ["!", "@", "#", "$", "%"];
						const isValid: boolean = new RegExp("[" + validCharacters.join("").toString() + "]", "g").test(control.value);
						return !isValid ? { oneSpecialChar: true } : undefined;
					},
				},
			],
		},
		{
			name: "email",
			label: "Email",
			type: TdDynamicElement.Input,
			required: true,
			validators: [
				{
					validator: (control: AbstractControl) => {
						const regexEmail = new RegExp(/^([a-zA-z0-9]+@fullstack.com)$/, "i");
						const isValid: boolean = regexEmail.test(control.value);
						return !isValid ? { emailValid: true } : undefined;
					},
				},
			],
		},
		{
			name: "dob",
			label: "Date Of Birth",
			flex: 50,
			type: TdDynamicElement.Datepicker,
			max: new Date(),
			validators: [
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value;
						return !isValid ? { notEmpty: true } : undefined;
					},
				},
			],
		},
		{
			name: "role",
			flex: 50,
			label: "Role",
			type: TdDynamicType.Array,
			selections: ["Admin", "SubAdmin", "User"],
			default: "User",
		},
	];
	constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {}

	submitManualValidator(): void {
		let finalDataToSend = {
			firstname: this.idForm.controls["firstname"].value,
			lastname: this.idForm.controls["lastname"].value,
			password: this.idForm.controls["password"].value,
			role: this.idForm.controls["role"].value,
			email_id: this.idForm.controls["email"].value,
			dob: this.idForm.controls["dob"].value,
		};
		console.log(JSON.stringify(finalDataToSend, null, 2), "final object");
		this.authService.register(finalDataToSend).subscribe(
			(res: any) => {
				this.router.navigate([`/login`], { queryParams: { username: res.username } }).then((_) => console.log("You are registered now!"));
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
}
