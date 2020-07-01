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


  constructor(public postService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.post = new Post();
    /* built-in Observable - no need to unsubscribe */
    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          /* Alternate would be to fetch Post from the server */
          this.post = this.postService.getPost(this.postId);
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  /* renamed from onAddPost(form:NgForm) */
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.message);
    } else {
      this.postService.updatePost(
        this.postId,
        form.value.title,
        form.value.message
       );
    }
    console.log(`Title: ${form.value.title} Message: ${form.value.message}`);
    /* Replaced this.postCreated.emit(post); by the postService */
    form.resetForm();
  }
}
