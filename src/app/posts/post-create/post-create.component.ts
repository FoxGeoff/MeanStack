import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT';
  enteredValue = '';

  constructor() { }

  ngOnInit(): void {
  }

  onAddPost(postTextarea: HTMLTextAreaElement) {
    this.newPost = this.enteredValue;

    // this.newPost = postTextarea.value;
    // this.newPost = 'The user\'s post';

    /* debug using 'consols.dir' - Shows all DOM element meta data*/
    // console.dir(postTextarea);
  }

}
