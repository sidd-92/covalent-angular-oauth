import { Component, OnInit, ViewChild } from "@angular/core";
import { ErrorStateMatcher } from "@angular/material/core";

import { ITdDynamicElementConfig, TdDynamicElement, TdDynamicType, TdDynamicFormsComponent } from "@covalent/dynamic-forms";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
	@ViewChild("manualValidateForm", { static: true })
	manualValidateForm: TdDynamicFormsComponent;
	@ViewChild("passwordValidForm", { static: true })
	passwordValidForm: TdDynamicFormsComponent;
	@ViewChild("manualValidateFormLN", { static: true }) manualValidateFormLN: TdDynamicFormsComponent;
	@ViewChild("idForm", { static: true }) idForm: TdDynamicFormsComponent;
	registerForm: FormGroup;
	firstname = "";
	lastname = "";
	email_id = "";
	password = "";
	control: FormControl;
	isLoadingResults = false;
	roles = [
		{ value: "admin", viewValue: "Admin" },
		{ value: "subadmin", viewValue: "Sub Admin" },
		{ value: "user", viewValue: "User" },
	];
	roleControl = new FormControl("", Validators.required);
	matcher = new MyErrorStateMatcher();
	textElements: ITdDynamicElementConfig[] = [
		{
			name: "input",
			hint: "this is an input hint",
			type: TdDynamicElement.Input,
			required: false,
			flex: 50,
		},
		{
			name: "requiredInput",
			label: "Input Label",
			type: TdDynamicElement.Input,
			required: true,
			validators: [
				{
					validator: Validators.pattern(/^([a-zA-z]{4,32})$/i),
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 8 && control.value.length <= 20;
						return !isValid ? { reqLen: true } : undefined;
					},
				},
			],
			flex: 50,
		},
		{
			name: "textLength",
			label: "Text Length",
			type: TdDynamicElement.Input,
			minLength: 4,
			maxLength: 12,
			flex: 50,
		},
		{
			name: "text",
			type: TdDynamicElement.Input,
			required: false,
			default: "Default",
			flex: 50,
			validators: [
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 8 && control.value.length <= 20;
						return !isValid ? { reqLen: true } : undefined;
					},
				},
			],
		},
		{
			name: "textarea",
			hint: "this is a textarea hint",
			type: TdDynamicElement.Textarea,
			required: false,
		},
		{
			name: "requiredPassword",
			label: "Password Label",
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
						const isValid: boolean = control.value && control.value.length >= 8 && control.value.length <= 20;
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
	];
	constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.registerForm = this.formBuilder.group({
			password: [null, Validators.required],
			firstname: [null, Validators.required],
			lastname: [null, Validators.required],
			email_id: [null, Validators.required],
			role: [null, Validators.required],
		});
	}

	passwordValidatorElement: ITdDynamicElementConfig[] = [
		{
			name: "requiredPassword",
			label: "Password Label",
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
						const isValid: boolean = control.value && control.value.length >= 8 && control.value.length <= 20;
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
	];

	manualValidatorElementLN: ITdDynamicElementConfig[] = [
		{
			name: "requiredInput",
			label: "Lastname",
			type: TdDynamicElement.Input,
			validators: [
				{
					validator: Validators.pattern(/^([a-zA-z]{4,32})$/i),
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 4 && control.value.length <= 20;
						return !isValid ? { length: true } : undefined;
					},
				},
			],
			required: true,
		},
	];

	manualValidatorElement: ITdDynamicElementConfig[] = [
		{
			name: "input",
			label: "Firstname",
			type: TdDynamicElement.Input,
			validators: [
				{
					validator: Validators.pattern(/^([a-zA-z]{4,32})$/i),
				},
				{
					validator: (control: AbstractControl) => {
						const isValid: boolean = control.value && control.value.length >= 4 && control.value.length <= 20;
						return !isValid ? { length: true } : undefined;
					},
				},
			],
			required: true,
		},
	];
	onFormSubmit(): void {
		this.isLoadingResults = true;
		//console.log(this.textElements[1], "ELMENS");
		//console.log(this.control, "convalentFormControl");
	}
	submitManualValidator(): void {
		console.log(this.idForm.controls["requiredInput"].value, "IDFORM");
		const key_input: string = "input";
		const key_array: string = "array";
		const key_date_input: string = "dateInput";
		const key_password_input: string = "requiredPassword";
		const control_input: AbstractControl = this.manualValidateForm.controls[key_input];
		//const control_array: AbstractControl = this.manualValidateForm.controls[key_array];
		//const control_date_input: AbstractControl = this.manualValidateForm.controls[key_date_input];
		//const control_password_input: AbstractControl = this.passwordValidForm.controls[key_password_input];

		console.log(control_input.value);
		//console.log(control_array.value);
		//console.log(control_date_input.value);
		//console.log(btoa(control_password_input.value));
	}
}

/* this.authService.register(this.registerForm.value).subscribe(
  (res: any) => {
    this.isLoadingResults = false;
    this.router
    .navigate(["/login"])
    .then((_) => console.log("You are registered now!"));
  },
  (err: any) => {
    console.log(err);
    this.isLoadingResults = false;
  }
  ); */
/* registerForm: FormGroup;
  firstname = "";
  lastname = "";
  email_id = "";
  password = "";
  control: FormControl;
  isLoadingResults = false;
  roles = [
    { value: "admin", viewValue: "Admin" },
    { value: "subadmin", viewValue: "Sub Admin" },
    { value: "user", viewValue: "User" },
  ];
  roleControl = new FormControl("", Validators.required);
  matcher = new MyErrorStateMatcher();
  textElements: ITdDynamicElementConfig[] = [
    {
      name: "text",
      type: TdDynamicType.Text,
      required: false,
      default: "Default",
      disabled: true,
    },
    {
      name: "input",
      hint: "this is an input hint",
      type: TdDynamicElement.Input,
      required: false,
    },
    {
      name: "requiredInput",
      label: "Input Label",
      type: TdDynamicElement.Input,
      required: true,
    },
    {
      name: "textLength",
      label: "Text Length",
      type: TdDynamicElement.Input,
      minLength: 4,
      maxLength: 12,
    },
    {
      name: "textarea",
      hint: "this is a textarea hint",
      type: TdDynamicElement.Textarea,
      required: false,
    },
    {
      name: "requiredPassword",
      label: "Password Label",
      type: TdDynamicElement.Password,
      required: true,
    },
    {
      name: "dateInput",
      label: "Select a date",
      hint: "this is a datepicker hint",
      type: TdDynamicElement.Datepicker,
      min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
    },
    {
      name: "array",
      type: TdDynamicType.Array,
      selections: ["Test1", "Test2", "Test3", "Test4"],
      default: "Test1",
    },
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      password: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email_id: [null, Validators.required],
      role: [null, Validators.required],
    });
  }
  
  onFormSubmit(): void {
    this.isLoadingResults = true;
    console.log(this.textElements[1], "ELMENS");
    console.log(this.control, "convalentFormControl");
  } */

/* @ViewChild("manualValidateForm", { static: true })
  manualValidateForm: TdDynamicFormsComponent;

  manualValidatorElement: ITdDynamicElementConfig[] = [
    {
      name: "vowelsElement",
      label: "Vowels only",
      type: TdDynamicType.Text,
      required: true,
    },
  ];

  submitManualValidator(): void {
    const key: string = "vowelsElement";
  } */

/*

		{
			name: "textLength",
			label: "Text Length",
			type: TdDynamicElement.Input,
			minLength: 4,
			maxLength: 12,
		},

		{
			name: "dateInput",
			label: "Select a date",
			hint: "this is a datepicker hint",
			type: TdDynamicElement.Datepicker,
			min: new Date(2018, 1, 1).setHours(0, 0, 0, 0),
		},
		{
			name: "array",
			type: TdDynamicType.Array,
			selections: ["Test1", "Test2", "Test3", "Test4"],
			default: "Test1",
		},
  */
