import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../../../models/post';
import { PostsService } from 'src/app/service/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 3];

  private postSubscription: Subscription;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSubscription = this.postsService.getPostUpdate$()
      .subscribe(
        (posts: Post[]) => {
          this.isLoading = false;
          this.posts = posts;
        });
  }

  onChangePage(pageData: PageEvent) {

  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }

}
