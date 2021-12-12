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

  constructor(public peopleService: PeopleService) { }
  private peopleSubscription!: Subscription;

  ngOnInit() {
    this.getPeople();
    this.peopleSubscription = this.peopleService.getPeopleUpdateListener().subscribe((people: Person[]) => {
      this.people = people;
    });

  }

  ngOnDestroy(): void {
    this.peopleSubscription.unsubscribe();
  }

  getPeople() {
    this.people = this.peopleService.getPeople();
  }

  // getDate(timestamp?: string): string {
  //   const date = timestamp ? new Date(timestamp) : new Date();
  //   return timestamp ? date.toLocaleString() : date.toDateString();
  // }

  refreshPosts(button: Event) {
    this.getPeople();
    (button.target as HTMLButtonElement).classList.add("loading");
    setTimeout(() => {
      (button.target as HTMLButtonElement).blur();
      (button.target as HTMLButtonElement).classList.remove("loading");
    }, 1200);
  }
}

