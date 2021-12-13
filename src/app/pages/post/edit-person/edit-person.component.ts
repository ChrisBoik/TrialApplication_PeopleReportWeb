import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'src/app/models/person.model';
import { PeopleService } from 'src/app/services/people-service.service';

@Component({
  selector: 'edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css']
})
export class EditPersonComponent implements OnInit {

  constructor(private route: ActivatedRoute, public peopleService: PeopleService, public router: Router, private modalService: NgbModal) { }
  submitted = false;
  departments: string[] = [];
  @ViewChild('person') personForm!: NgForm;
  @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;

  viewingPerson: Person | undefined;

  ngOnInit(): void {
    setTimeout(() => { this.getPerson(); }, 300);
  }

  getPerson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.peopleService.getPerson(Number.parseInt(id)).then(p => {
        this.viewingPerson = p;
        this.personForm.form.setValue({
          first_name: this.viewingPerson?.First_Name,
          last_name: this.viewingPerson?.Last_Name,
          date_of_birth: formatDate(this.viewingPerson?.Date_of_Birth, "yyyy-MM-dd", "En-ZA"),
          person_id: this.viewingPerson?.Id
        })
      });
    }

  }

  onSaveEdits(PersonForm: NgForm): void {
    // Store submitted status to show validation
    this.submitted = true;
    if (PersonForm.invalid) {
      return;
    }

    const person: Person = new Person({
      Id: this.viewingPerson?.Id ?? PersonForm.value.person_id,
      First_Name: PersonForm.value.first_name,
      Last_Name: PersonForm.value.last_name,
      Date_of_Birth: PersonForm.value.date_of_birth,
    });

    //Redirect to people list after updating
    this.peopleService.updatePerson(person).then(updatedPersonId => this.router.navigate([`/`])).catch(err => console.error("Error updating person, try again."));
  }

  onDelete(PersonForm: NgForm): void {
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((reason: any) => {
      if (reason == "Confirm") {
        this.peopleService.deletePerson(this.viewingPerson?.Id ?? PersonForm.value.person_id)
          .then(deletedPersonId => this.router.navigate([`/`])).catch(err => console.error("Error deleting person, try again."));
      }
    });
  }

}
