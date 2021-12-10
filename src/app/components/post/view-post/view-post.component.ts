import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post-service.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  viewingPost: Post | undefined;

  constructor(private route: ActivatedRoute, private postService: PostService) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.postService.getPost(id).then(p => {
        this.viewingPost = p;
      });
    }
  }

  getDate(timestamp?: string): string {
    const date = timestamp ? new Date(timestamp) : new Date();
    return timestamp ? date.toLocaleString() : date.toDateString();
  }

}
