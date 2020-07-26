import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from 'src/app/service/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, AfterViewInit {
  noPosts = 'No posts to display';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(
    public postService: PostsService,
    public route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      message: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
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
                message: postData.post.message,
                imagePath: postData.post.imagePath,
                creator: postData.post.creator
              };
              console.log(`From server Message: ${postData.msg}`);
              this.form.setValue({
                title: this.post.title,
                message: this.post.message,
                image: postData.post.imagePath
              });
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  ngAfterViewInit(): void { }

  /* Event is a built in JavaScript even  */
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    /* image control in not an actual control on the form, file JS obj */
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);

    /* store an image previw */
    const reader = new FileReader();
    reader.onload = () => {
      if (!(reader instanceof ArrayBuffer)) {
        this.imagePreview = (reader.result as string);
      } else {
        throw new Error('Unexpected result not a string value');
      }
    };
    reader.readAsDataURL(file);
  }

  /* renamed from onAddPost(form:NgForm) */
  onSavePost() {

    if (this.form.invalid) {
      console.log(`onSave(form) is invalid ${this.form.value.image}`);
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.message,
        this.form.value.image
        );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.message,
        this.form.value.image
      );
    }
    console.log(`onSave(form): Title: ${this.form.value.title} Message: ${this.form.value.message}`);
    this.form.reset();
  }
}
