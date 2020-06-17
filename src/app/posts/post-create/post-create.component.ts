import { Component, OnInit } from '@angular/core';
import { Post } from './post-list/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  noPosts = 'No posts to display';
  enteredTitle = '';
  enteredMessage = '';
  posts: Post[];

  constructor() { }

  ngOnInit(): void {
    this.posts = [];
  }

  onAddPost() {
    // TODO: create a new post
    // TODO: add the new post to posts[] in post-list component
  }

}
