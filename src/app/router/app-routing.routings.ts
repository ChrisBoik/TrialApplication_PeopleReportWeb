import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BirthdayReportComponent } from '../pages/post/birthday-report/birthday-report.component';
import { CreatePersonComponent } from '../pages/post/create-person/create-person.component';
import { EditPersonComponent } from '../pages/post/edit-person/edit-person.component';
import { PeopleListComponent } from '../pages/post/list-people/people-list.component';
// import { OrderCreateComponent } from '../components/order/order-create/order-create.component';
// import { OrderPlacedComponent } from '../components/order/order-placed/order-placed.component';


const routes: Routes = [
  { path: "", component: PeopleListComponent, },
  { path: "person/new", component: CreatePersonComponent,  },
  { path: "person/edit/:id", component: EditPersonComponent, },

  { path: "birthdays", component: BirthdayReportComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
