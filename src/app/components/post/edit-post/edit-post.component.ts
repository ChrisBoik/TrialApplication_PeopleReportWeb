import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth-service';
import { PostService } from 'src/app/services/post-service.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  constructor(private route: ActivatedRoute, public postService: PostService, public authService: AuthService, public router: Router) { }
  submitted = false;
  departments: string[] = [];
  @ViewChild('post') postForm!: NgForm;



  viewingPost: Post | undefined;

  ngOnInit(): void {
    this.departments = this.postService.getDepartments();
    this.getPost();
  }

  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.postService.getPost(id, true).then(p => {
        this.viewingPost = p;
        this.postForm.form.patchValue({
          title: this.viewingPost?.title,
          department: this.viewingPost?.department,
          body: this.viewingPost?.text
        })
      });
    }

  }

  onSaveEdits(PostForm: NgForm): void {
    this.submitted = true;
    if (PostForm.invalid) {
      console.log(PostForm.controls)
      return;
    }
    const post: Post = {
      id: this.route.snapshot.paramMap.get('id')!,
      title: PostForm.value.title,
      username: this.authService.getEmail(),
      department: PostForm.value.department,
      text: PostForm.value.body
    };
    //TODO redirect to updated post
    this.postService.updatePost(post).then(updatedPostId => this.router.navigate([`/`])).catch(err => alert("Error updating post, try again."));
  }

}
