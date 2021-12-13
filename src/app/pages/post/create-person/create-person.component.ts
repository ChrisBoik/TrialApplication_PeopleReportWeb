import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"
import { Person } from "src/app/models/person.model"
import { Router } from '@angular/router';
import { PeopleService } from 'src/app/services/people-service.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-order-create',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.css']
})
export class CreatePersonComponent implements OnInit {

  constructor(public peopleService: PeopleService, public router: Router) {
    this.maximumDate = formatDate(new Date(), "yyyy-MM-dd", "En-ZA");
  }
  submitted = false;
  maximumDate: string;

  ngOnInit(): void {
  }

  // usernameError = "Username error"
  // emailError = "Email error"
  // orderError = "Order error"

  onCreatePerson(PostForm: NgForm): void {
    
    // Store the submitted status to show validation
    this.submitted = true;

    // Don't save the person if the form is invalid
    if (PostForm.invalid) {
      return;
    }
    
    const person: Person = new Person({
      Id: null,
      First_Name: PostForm.value.first_name,
      Last_Name: PostForm.value.last_name,
      Date_of_Birth: PostForm.value.date_of_birth,
    });

    // Redirect to people list after saving
    this.peopleService.addPerson(person).then(newPostId => this.router.navigate([`/`])).catch(err => console.error("Error creating person, try again."));
  }

}
