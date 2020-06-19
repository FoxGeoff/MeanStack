import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from 'src/app/service/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  noPosts = 'No posts to display';

  constructor(private postService: PostsService) { }

  ngOnInit(): void { }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log(`Title: ${form.value.title} Message: ${form.value.messagee}`);

    /* Replaced this.postCreated.emit(post); by the postService */

    this.postService.addPost(form.value.title, form.value.message);
    form.resetForm();
  }



}
