import { Person } from '../models/person.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  private API_Endpoint = "https://trialapplicationpeoplereport20211212153111.azurewebsites.net";

  private people: Person[] = [];
  private numBirthdaysInMonths: { Month: number, Num_Month_Birthdays: number }[] = [];
  private updatedPeople = new Subject<Person[]>();
  private updatedBirthdaysInMonths = new Subject<{ Month: number, Num_Month_Birthdays: number }[]>();

  constructor(private http: HttpClient) { }

  getPeople(): Person[] {
    this.http.get<Person[]>(`${this.API_Endpoint}/person`)
      .pipe(map((peopleData) => {
        return peopleData.map((person: Person) => {
          const personData = new Person({
            Id: person.Id!,
            First_Name: person.First_Name,
            Last_Name: person.Last_Name,
            Date_of_Birth: person.Date_of_Birth,
          });
          return personData;
        });
      }))
      .subscribe((changedPosts) => {
        this.people = changedPosts;
        this.updatedPeople.next([...this.people]);
      });
    return [...this.people];
  }

  async addPerson(person: Person): Promise<number | null | undefined> {
    return this.http.post<{ person: Person }>(`${this.API_Endpoint}/person`, person).toPromise().then((responsePostData) => {
      this.people.push(person);
      this.updatedPeople.next(this.getPeople());
      return Promise.resolve(person.Id);
    });
  }

  async updatePerson(person: Person): Promise<number | null | undefined> {
    return this.http.put<{ person: Person }>(`${this.API_Endpoint}/person/${person.Id}`, person).toPromise().then((responsePostData) => {
      this.people[this.people.findIndex(p => p.Id = person.Id)] = person;
      this.updatedPeople.next(this.getPeople());
      return Promise.resolve(person.Id);
    })
  }

  getPeopleUpdateListener(): Observable<Person[]> {
    return this.updatedPeople.asObservable();
  }

  deletePerson(personId: number): Promise<number> {
    return this.http.delete(`${this.API_Endpoint}/person/${personId}`).toPromise().then((responsePostData) => {
      this.people = this.people.filter(p => p.Id !== personId);
      this.updatedPeople.next([...this.people]);
      console.log(`Deleted person with Id: ${personId}`);
      return Promise.resolve(personId);
    });
  }

  async getPerson(id: number): Promise<Person> {
    return this.people.find(p => p.Id === id) ?? await this.fetchPerson(id).then(p => {
      return p.person;
    });
  }

  fetchPerson(id: number): Promise<{ person: Person }> {
    // const params = new HttpParams().set('Id', id.toString());
    return this.http.get<{ person: Person }>(`${this.API_Endpoint}/person/${id}`).toPromise();
  }

  getNumberBirthdaysInMonths(): Observable<{ Month: number; Num_Month_Birthdays: number; }[]> {
    let request = this.http.get<{ Month: number, Num_Month_Birthdays: number }[]>(`${this.API_Endpoint}/person/birthdays`)
      .pipe(map((numData) => {
        return numData;
      }));

    request.subscribe((changedPosts) => {
      this.numBirthdaysInMonths = changedPosts;
      this.updatedBirthdaysInMonths.next([...this.numBirthdaysInMonths]);
    });
    return request;
  }

}
