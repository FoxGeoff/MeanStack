import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../../../models/post';
import { PostsService } from 'src/app/service/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  postSubscription: Subscription;
  posts: Post[] = [
    /*
        { title: 'First Post', message: 'this is the first post' },
        { title: 'Second Post', message: 'this is the second post' },
        { title: 'Third Post', message: 'this is the third post' },
        { title: 'Fourth Post', message: 'this is the fourth post' },
        { title: 'Fifth Post', message: 'this is the fifth post' },
        { title: 'Sixth Post', message: 'this is the sixth post' },
    */
  ];

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postSubscription = this.postsService.getPostUpdate$()
      .subscribe(
        (posts: Post[]) => { this.posts = posts; });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }

}
