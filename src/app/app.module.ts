import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CovalentLayoutModule } from "@covalent/core/layout";
import { CovalentStepsModule } from "@covalent/core/steps";
/* any other core modules */
// (optional) Additional Covalent Modules imports
import { MatListModule } from "@angular/material/list";
import { CovalentHttpModule } from "@covalent/http";
import { CovalentHighlightModule } from "@covalent/highlight";
import { CovalentMarkdownModule } from "@covalent/markdown";
import { CovalentDynamicFormsModule } from "@covalent/dynamic-forms";
import { CovalentBaseEchartsModule } from "@covalent/echarts/base";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.inteceptor";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { RegisterComponent } from './register/register.component';
import { SecureComponent } from './secure/secure.component';
import { NotFoundComponent } from './not-found/not-found.component';
@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, SecureComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CovalentLayoutModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
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
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentDynamicFormsModule,
    CovalentBaseEchartsModule,
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
