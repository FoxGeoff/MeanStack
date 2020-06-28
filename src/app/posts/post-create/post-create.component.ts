import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  noPosts = 'No posts to display';
  post: Post;
  private mode = 'create';
  private postId: string;


  constructor(private postService: PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.post = this.postService.getPost(this.postId);
        } else {
          this.mode = 'create';
          this.mode = null;
        }
      });

  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log(`Title: ${form.value.title} Message: ${form.value.message}`);

    /* Replaced this.postCreated.emit(post); by the postService */

    this.postService.addPost(form.value.title, form.value.message);
    form.resetForm();
  }
}
