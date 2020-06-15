import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT';

  constructor() { }

  ngOnInit(): void {
  }

  onAddPost(postTextarea: HTMLTextAreaElement) {
    this.newPost = postTextarea.value;
    // this.newPost = 'The user\'s post';
  }

}
