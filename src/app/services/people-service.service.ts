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


  /**
   * Get list of people.
   *
   * Fetches a list of people with their details.
   * 
   * @fires   updatedBirthdaysInMonths
   *
   * @return {Person[]}  An array of People.
   */
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


  /**
   * Add new Person.
   *
   * Add a newly created Person to the database.
   * 
   * @fires   updatedPeople
   *
   * @param   {Person} person       A qualified person object without the Id value.
   *
   * @return  {Promise<number>}     A promise which resolves to a user Id
   */
  async addPerson(person: Person): Promise<number | undefined> {
    return this.http.post<{ person: Person }>(`${this.API_Endpoint}/person`, person).toPromise().then((responsePostData) => {
      this.people.push(person);
      this.updatedPeople.next(this.getPeople());
      return Promise.resolve(person.Id);
    });
  }


  /**
  * Edit a person.
  *
  * Edit a persons details.
  * 
  * @fires   updatedPeople
  *
  * @param   {Person} person       A fully-qualified person object with the Id and edited values.
  *
  * @return  {Promise<number>}     A promise which resolves to a user Id
  */
  async updatePerson(person: Person): Promise<number | undefined> {
    return this.http.put<{ person: Person }>(`${this.API_Endpoint}/person/${person.Id}`, person).toPromise().then((responsePostData) => {
      this.people[this.people.findIndex(p => p.Id = person.Id)] = person;
      this.updatedPeople.next(this.getPeople());
      return Promise.resolve(person.Id);
    })
  }


  /**
  * Get people observable.
  *
  * Provides an observable for changes to the list of people in memory
  * 
  * @return  {Observable<Person[]>}     A promise which resolves to a user Id
  */
  getPeopleUpdateListener(): Observable<Person[]> {
    return this.updatedPeople.asObservable();
  }


  /**
  * Delete a person.
  *
  * Deletes a person from the database.
  * 
  * @fires   updatedPeople
  *
  * @param   {number} personId     A valid user Id
  *
  * @return  {number}              A promise which resolves to a user Id
  */
  async deletePerson(personId: number): Promise<number> {
    return this.http.delete(`${this.API_Endpoint}/person/${personId}`).toPromise().then((responsePostData) => {
      this.people = this.people.filter(p => p.Id !== personId);
      this.updatedPeople.next([...this.people]);
      console.log(`Deleted person with Id: ${personId}`);
      return Promise.resolve(personId);
    });
  }


  /**
  * Get a person.
  *
  * Gets a specific user's details by Id. Either from memory or, if not in memory, from the database.
  *
  * @param   {number} personId     A valid user Id
  *
  * @return  {Person}              Returns the requested person object.
  */
  async getPerson(id: number): Promise<Person> {
    return this.people.find(p => p.Id === id) ?? await this.fetchPerson(id).then(p => {
      return p.person;
    });
  }


  /**
  * Fetch a person.
  *
  * Fetches a specific user's details by Id from the database.
  *
  * @param   {number} personId     A valid user Id
  *
  * @return  {Promise<Promise>}    Returns the requested person object.
  */
  fetchPerson(id: number): Promise<{ person: Person }> {
    return this.http.get<{ person: Person }>(`${this.API_Endpoint}/person/${id}`).toPromise();
  }


  /**
  * Get number of birthdays in months.
  *
  * Gets the number of people's birthdays in the months of the year.
  *
  * @fires   updatedBirthdaysInMonths
  * 
  * @return  {Observable<{number; number; }[]>}   Returns an observable of an array containing month
  *         numbers and the number of birthdays in that month.
  */
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
