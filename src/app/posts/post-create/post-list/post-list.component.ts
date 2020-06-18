import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../models/post';
import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  @Input() posts: Post[] = [
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
  }

   

}
