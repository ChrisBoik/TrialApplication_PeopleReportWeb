import { Post } from '../models/post.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private updatedPosts = new Subject<Post[]>();
  private departments: string[] = [];

  constructor(private http: HttpClient) { }

  getPosts(): Post[] {
    this.http.get<{ message: string, posts: Post[] }>('/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post: any) => {
          return {
            id: post._id,
            title: post.title,
            timestamp: post.timestamp || '',
            username: post.username,
            department: post.department,
            text: post.text,
          };
        });
      }))
      .subscribe((changedPosts) => {
        this.posts = changedPosts;
        this.updatedPosts.next([...this.posts]);
      });
    return [...this.posts];
  }

  async getPost(id: string, raw: boolean = false): Promise<Post> {
    return raw == false ? this.posts.find(p => p.id === id) ?? await this.fetchPost(id, false).then(p => {
      return p.post;
    }) : await this.fetchPost(id, raw).then(p => {
      return p.post;
    });
  }

  fetchPost(id: string, raw: boolean = false): Promise<{ message: string, post: Post, raw?: boolean }> {
    const params = new HttpParams().set('id', id).set('raw', raw.toString());
    return this.http.get<{ message: string, post: Post }>('/api/posts', { params }).toPromise();
  }

  async addPost(post: Post): Promise<string | null | undefined> {
    return this.http.post<{ message: string }>('/api/posts', post).toPromise().then((responsePostData) => {
      // console.log(responsePostData.message);
      this.posts.push(post);
      this.updatedPosts.next(this.getPosts());
      return Promise.resolve(post.id);
    });
  }

  async updatePost(post: Post): Promise<string | null | undefined> {
    return this.http.post<{ message: string; }>(`/api/posts/edit/${post.id}`, post).toPromise().then((responsePostData) => {
      // console.log(responsePostData.message);
      this.posts[this.posts.findIndex(p => p.id = post.id)] = post;
      this.updatedPosts.next(this.getPosts());
      return Promise.resolve(post.id);
    })
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.updatedPosts.asObservable();
  }

  deletePost(postID: string): void {
    this.http.delete(`/api/posts/${postID}`)
      .subscribe(() => {
        this.posts = this.posts.filter(posts => posts.id !== postID);
        this.updatedPosts.next([...this.posts]);
        // console.log('Deleted post.');
      });
  }

  getDepartments(): string[] {
    return this.departments = this.posts.map(post => post.department).filter((value, index, self) => self.indexOf(value) === index);
  }

}
