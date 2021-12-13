import { Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/services/people-service.service';

@Component({
  selector: 'app-birthday-report',
  templateUrl: './birthday-report.component.html',
  styleUrls: ['./birthday-report.component.css']
})
export class BirthdayReportComponent implements OnInit {

  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  constructor(public peopleService: PeopleService) { }

  public numBirthdaysInMonths: number[] = [];

  async ngOnInit() {

    // Fetch the number of birthdays in each month
    this.peopleService.getNumberBirthdaysInMonths().subscribe((numBirthdays) => {
      this.monthNames.forEach((_month, index) => {
        this.numBirthdaysInMonths.push(numBirthdays.find(({ Month }) => Month === (index + 1))?.Num_Month_Birthdays ?? 0)
      });
    });
  }
}
