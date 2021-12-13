import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Person } from 'src/app/models/person.model';
import { PeopleService } from "src/app/services/people-service.service"

@Component({
  selector: 'people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit, OnDestroy {

  people: Person[] = [];
  peopleLoaded = false;

  constructor(public peopleService: PeopleService) { }
  private peopleSubscription!: Subscription;

  ngOnInit() {
    // Fetch people initially and then listen for people updates via subscription
    this.getPeople();
    this.peopleSubscription = this.peopleService.getPeopleUpdateListener().subscribe((people: Person[]) => {
      this.people = people;
      this.peopleLoaded = true;
    });

  }

  // Clean up subscriptions
  ngOnDestroy(): void {
    this.peopleSubscription.unsubscribe();
  }

  // Fetch people via the people service
  getPeople() {
    this.people = this.peopleService.getPeople();
  }

  // Show the refreshing status and re-fetch the latest people list
  refreshPosts(button: Event) {
    this.peopleLoaded = false;
    this.getPeople();
    (button.target as HTMLButtonElement).classList.add("loading");
    setTimeout(() => {
      (button.target as HTMLButtonElement).blur();
      (button.target as HTMLButtonElement).classList.remove("loading");
    }, 1200);
  }
}

