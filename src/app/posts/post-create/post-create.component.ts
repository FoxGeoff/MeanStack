import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../models/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  noPosts = 'No posts to display';
  @Output() postCreated = new EventEmitter<Post>();

  constructor() { }

  ngOnInit(): void { }

  onAddPost(form: NgForm) {
    if (form.invalid){
      return;
    }
    const post = {
      title: form.value.title,
      message: form.value.message
    };

    console.log(`Title: ${post.title} Message: ${post.message}`);

    this.postCreated.emit(post);
  }

}
