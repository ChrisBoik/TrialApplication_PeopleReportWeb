import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms"
import { PostService } from 'src/app/services/post-service.service';
import { Post } from "src/app/models/post.model"
import { AuthService } from 'src/app/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public postService: PostService, public authService: AuthService, public router: Router) { }
  submitted = false;
  departments: string[] = [];

  ngOnInit(): void {
    this.departments = this.postService.getDepartments();
  }

  // usernameError = "Username error"
  // emailError = "Email error"
  // orderError = "Order error"

  onCreatePost(PostForm: NgForm): void {
    this.submitted = true;
    if (PostForm.invalid) {
      return;
    }
    const post: Post = {
      title: PostForm.value.title,
      username: this.authService.getEmail(),
      department: PostForm.value.department,
      text: PostForm.value.body
    };
    //TODO redirect to created post after creation or show error
    this.postService.addPost(post).then(newPostId => this.router.navigate([`/`])).catch(err => alert("Error creating post, try again."));
  }

}
