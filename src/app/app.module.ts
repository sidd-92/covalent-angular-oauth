import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
/* any other core modules */
// (optional) Additional Covalent Modules imports
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { CovalentMessageModule } from "@covalent/core/message";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CovalentLayoutModule } from "@covalent/core/layout";
import { CovalentStepsModule } from "@covalent/core/steps";
import { CovalentDynamicFormsModule } from "@covalent/dynamic-forms";
import { CovalentBaseEchartsModule } from "@covalent/echarts/base";
import { CovalentHighlightModule } from "@covalent/highlight";
import { CovalentHttpModule } from "@covalent/http";
import { CovalentMarkdownModule } from "@covalent/markdown";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./auth.inteceptor";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RegisterComponent } from "./register/register.component";
import { SecureComponent } from "./secure/secure.component";
@NgModule({
	declarations: [AppComponent, LoginComponent, RegisterComponent, SecureComponent, NotFoundComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		CovalentLayoutModule,
		MatInputModule,
		MatPaginatorModule,
		MatTableModule,
		MatSortModule,
		MatCardModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		CovalentStepsModule,
		CovalentHttpModule.forRoot(),
		MatListModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatDatepickerModule,
		MatNativeDateModule,
		FormsModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		CovalentHighlightModule,
		CovalentMarkdownModule,
		CovalentDynamicFormsModule,
		CovalentBaseEchartsModule,
		CovalentMessageModule,
		BrowserAnimationsModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
