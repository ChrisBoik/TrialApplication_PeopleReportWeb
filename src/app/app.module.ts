import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './router/app-routing.routings';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatDialogModule } from '@angular/material/dialog';
import { EditPersonComponent } from './pages/post/edit-person/edit-person.component';
import { CreatePersonComponent } from './pages/post/create-person/create-person.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from './pages/post/list-people/people-list.component';
import { BirthdayReportComponent } from './pages/post/birthday-report/birthday-report.component';


@NgModule({
  declarations: [
    AppComponent,
    PeopleListComponent,
    CreatePersonComponent,
    EditPersonComponent,
    BirthdayReportComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,

    MatIconModule,
    MatDialogModule,
    NgbModule,

    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule { }
