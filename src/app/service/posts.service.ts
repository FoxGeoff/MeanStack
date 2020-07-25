import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { title } from 'process';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate$ = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  /* using an array copy, is best practice
   *  but it can create an issue
   *  Fix by using an event driven approach with rxjs
   */
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    /* on destroy not required here bcause it is built into the api. */
    this.http
      .get<{ maxPosts: number, msg: string, posts: any }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                message: post.message,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostsData) => {

        /* Debug: check */
        console.log(`getPosts, transformed Post data: ${transformedPostsData}`);

        this.posts = transformedPostsData.posts;
        this.postsUpdate$.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  /* used for the edit form, init on create-post*/
  getPostLocal(postId: string) {
    return { ...this.posts.find(p => p.id === postId) };
  }

  /* used for the edit form, init on create-post*/
  getPost(postId: string) {
    return this.http
      .get<{ post: any, msg: string }>(`http://localhost:3000/api/posts/${postId}`);
  }

  getPostUpdate$() {
    return this.postsUpdate$.asObservable();
  }

  /* With "post" with file image post update format (FormData format) */
  addPost(postTitle: string, postMessage: string, image: File) {
    /* allows text and blob values */
    const postData = new FormData();
    postData.append('title', postTitle);
    postData.append('message', postMessage);
    postData.append('image', image, postTitle); // file, file name

    this.http
      .post<{ msg: string, postId: string, imagePath: string }>(
        'http://localhost:3000/api/posts',
        postData // auto handles non JSON data headers
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  /* used for the edit form */
  updatePost(postId: string, postTitle: string, postMessage: string, image: File | string) {
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: one-variable-per-declaration
    let postData: Post | FormData;

    if (typeof (image) === 'object') {
      /* FormData - image is object  */
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', postTitle);
      postData.append('message', postMessage);
      postData.append('image', image, postTitle);

    } else {
      /* JSON - image is string path  */
      postData = {
        id: postId,
        title: postTitle,
        message: postMessage,
        imagePath: image
      };
    }
    this.http
      .put(`http://localhost:3000/api/posts/${postId}`, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(`http://localhost:3000/api/posts/${postId}`);
  }
}
