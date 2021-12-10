import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from "src/app/services/post-service.service"

@Component({
  selector: 'app-order-placed',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  departments: string[] = [];
  departmentPages: Map<string, number> = new Map<string, number>();
  departmentCurrentPage: Map<string, number> = new Map<string, number>();

  constructor(public postService: PostService, private modalService: NgbModal) { }
  private postsSubscription!: Subscription;
  @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;

  ngOnInit() {
    this.getPosts();
    this.postsSubscription = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      // console.log(posts);
      this.posts = posts;
      this.departments = this.postService.getDepartments();
      // console.log(this.postService.getDepartments());
    });

  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

  getPosts() {
    this.posts = this.postService.getPosts();
  }

  onDelete(postID: string): void {
    let closeResult = '';
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((reason: any) => {
      if (reason == "Confirm") {
        // console.log(reason);

        this.departmentPagesChange(this.posts.find(p => p.id == postID)?.department || "");

        this.postService.deletePost(postID);
      }
    });
  }

  getDepartmentPosts(department: string, page?: number): Post[] {
    // console.log(page);
    const departmentPosts = this.posts.filter(p => p.department === department).filter((p, index) =>
      index >= (((page || 1) - 1) * 4) && index < (((page || 1) - 1) * 4) + 4);

    this.departmentPagesChange(department);
    return departmentPosts;
  }

  getDate(timestamp?: string): string {
    const date = timestamp ? new Date(timestamp) : new Date();
    return timestamp ? date.toLocaleString() : date.toDateString();
  }

  refreshPosts(button: Event) {
    this.getPosts();
    (button.target as HTMLButtonElement).classList.add("loading");
    setTimeout(() => {
      (button.target as HTMLButtonElement).blur();
      (button.target as HTMLButtonElement).classList.remove("loading");
    }, 1200);
  }

  getCleanExcerpt(input: string): string {
    const excerpt = input.replace(/<[^>]*>/g, '').trim().substr(0, 50).trim();
    if (excerpt === '' || excerpt.match(/^ *$/) !== null) {
      return 'Click to view this post.';
    }
    return excerpt.concat('...');
  }

  changeDepartmentPage(department: string, pageNum: number) {
    this.departmentCurrentPage.set(department, pageNum);
  }

  getDepartmentCurrentPage(department: string): number {
    return this.departmentCurrentPage.get(department)!;
  }

  departmentPagesChange(department: string) {
    const departmentPosts = this.posts.filter((p) => p.department === department);

    const departmentPostPagesLength = Math.ceil(departmentPosts.length / 4);
    this.departmentPages.set(department, departmentPostPagesLength);
    this.departmentCurrentPage.set(department, (this.departmentCurrentPage.get(department) || 1) > departmentPostPagesLength ? 1 : this.departmentCurrentPage.get(department) || 1);
  }
}

