import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { AppComponent } from './app.component';
// import { OrderCreateComponent } from "./components/order/order-create/order-create.component"

import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './router/app-routing.routings';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PostListComponent } from './components/post/post-list/post-list.component';
import { ViewPostComponent } from './components/post/view-post/view-post.component';

//NgBootstrap dependency for toolsets
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostCreateComponent } from './components/post/post-create/post-create.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';
import { PermissionComponent } from './components/permission/permission.component';


@NgModule({
  declarations: [
    AppComponent,
    // OrderCreateComponent,
    ViewPostComponent,
    PostListComponent,
    LoginComponent,
    RegisterComponent,
    PostCreateComponent,
    EditPostComponent,
    PermissionComponent
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
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule { }
