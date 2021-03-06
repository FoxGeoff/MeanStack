import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../../../models/post';
import { PostsService } from 'src/app/service/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  /* Pagination */
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 3];
  private postSubscription: Subscription; 
  /* Authentication */
  userIsAuthenticated = false;
  private authListenSubs: Subscription;
  public userId: string;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postsService.getPostUpdate$()
      .subscribe(
        (postsData: { posts: Post[], postCount: number }) => {
          this.isLoading = false;
          this.posts = postsData.posts;
          this.totalPosts = postsData.postCount;
        });
    /* FIX on first page visit - we see edit/delete after login */
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    /* Authentication - runs immediately */
    this.authListenSubs = this.authService.getAuthStatus$()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;

        this.userId = this.authService.getUserId();

      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.authListenSubs.unsubscribe();
  }
}
