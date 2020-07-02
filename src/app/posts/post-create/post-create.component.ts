import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, AfterViewInit {
  noPosts = 'No posts to display';
  post: Post;
  isLoading =  false;
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

          /* Fetch Post local  */
          // this.post = this.postService.getPostLocal(this.postId);

          /* Fetch Post from the server */
          this.isLoading = true;
          this.postService.getPost(this.postId)
            .subscribe((postData) => {
              this.isLoading = false;
              this.post = {
                id: postData.post._id,
                title: postData.post.title,
                message: postData.post.message
              };
              console.log(`From server Message: ${postData.msg}`);
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  ngAfterViewInit(): void { }

  /* renamed from onAddPost(form:NgForm) */
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      /* Replaced this.postCreated.emit(post); by the postService.addPost(post) */
      this.postService.addPost(form.value.title, form.value.message);
      form.resetForm();
    } else {
      this.postService.updatePost(
        this.postId,
        form.value.title,
        form.value.message
      );
    }
    console.log(`onSave(form): Title: ${form.value.title} Message: ${form.value.message}`);
  }
}
