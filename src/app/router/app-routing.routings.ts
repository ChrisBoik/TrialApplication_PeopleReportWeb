import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../services/router-services/auth-guard.service';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { PostListComponent } from '../components/post/post-list/post-list.component';
import { ViewPostComponent } from '../components/post/view-post/view-post.component';
import { PostCreateComponent } from '../components/post/post-create/post-create.component';
import { EditPostComponent } from '../components/post/edit-post/edit-post.component';
import { PermissionComponent } from '../components/permission/permission.component';
// import { OrderCreateComponent } from '../components/order/order-create/order-create.component';
// import { OrderPlacedComponent } from '../components/order/order-placed/order-placed.component';


const routes: Routes = [
  { path: "", component: PostListComponent, canActivate: [AuthGuardService] },
  { path: "post/create", component: PostCreateComponent, canActivate: [AuthGuardService] },
  { path: "post/edit/:id", component: EditPostComponent, canActivate: [AuthGuardService] },
  { path: "post/:id", component: ViewPostComponent, canActivate: [AuthGuardService] },
  { path: "users", component: PermissionComponent, canActivate: [AuthGuardService] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
