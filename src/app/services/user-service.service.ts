import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: { id: string, email: string, isHighLevel: boolean }[] = [];
  private updatedUsers = new Subject<{ id: string, email: string, isHighLevel: boolean }[]>();

  constructor(private http: HttpClient) { }

  getUsers(): { id: string, email: string, isHighLevel: boolean }[] {
    this.http.get<{ message: string, users: { id: string, email: string, isHighLevel: boolean }[] }>('/api/user')
      .pipe(map((userData) => {
        return userData.users.map((user: any) => {
          return {
            id: user._id,
            email: user.email,
            isHighLevel: user.isHighLevel,
          };
        });
      }))
      .subscribe((changedUsers) => {
        this.users = changedUsers;
        this.updatedUsers.next([...this.users]);
      });
    return [...this.users];
  }

  getUserUpdateListener(): Observable<{ id: string, email: string, isHighLevel: boolean }[]> {
    return this.updatedUsers.asObservable();
  }

  setPermissions(userID: string, isHighLevelUser: boolean) {
    // console.log(isHighLevelUser);
    this.http.post<{ message: string, users: { id: string, email: string, isHighLevel: boolean }[] }>(`/api/user/permissions/${userID}`, {isHighLevelUser}, ).toPromise();
  }

}
