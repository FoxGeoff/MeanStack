import { Component, OnInit, Output } from '@angular/core';
import { Post } from './post-list/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  @Output() newPost: Post;

  noPosts = 'No posts to display';
  enteredTitle = '';
  enteredMessage = '';
  posts: Post[];

  constructor() { }

  ngOnInit(): void {

  }

  onAddPost() {
    // TODO: add the new post to posts[] in post-list component

    this.newPost = {
      message: this.enteredMessage,
      title: this.enteredTitle
    };

    console.log(`Title: ${this.newPost.title} Message: ${this.newPost.message}`);
  }

}
