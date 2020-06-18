import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() postCreated = new EventEmitter<Post>();

  constructor() { }

  ngOnInit(): void {

  }

  onAddPost() {
    const newPost = {
      message: this.enteredMessage,
      title: this.enteredTitle
    };

    console.log(`Title: ${newPost.title} Message: ${newPost.message}`);

    this.postCreated.emit(newPost);

    this.enteredTitle = '';
    this.enteredMessage = '';
  }

}
