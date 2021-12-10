import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  users: { id: string, email: string, isHighLevel: boolean }[] = [];
  pages: number = this.users.length;
  currentPage: number = 1;

  private userSubscription!: Subscription;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.getUsers()
    this.userSubscription = this.userService.getUserUpdateListener().subscribe((users: { id: string, email: string, isHighLevel: boolean }[]) => {
      this.users = users;
      // console.log(this.users);
    });
  }

  getUsers() {
    this.users = this.userService.getUsers().filter((p, index) =>
      index >= (((this.currentPage || 1) - 1) * 6) && index <= (((this.currentPage || 1) - 1) * 6) + 6);
  }

  setPage(pageTo: number) {
    this.currentPage = pageTo;
  }

  changePermission(userID:string, checkbox: Event){
    const isChecked = (checkbox.target as HTMLInputElement).checked;
    
    this.userService.setPermissions(userID, isChecked);
  }


}
