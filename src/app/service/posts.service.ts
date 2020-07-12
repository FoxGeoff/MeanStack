import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { title } from 'process';
import { PostCreateComponent } from '../posts/post-create/post-create.component';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate$ = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    /* using a array copy, is best practice
    *  but it can create an issue
    *  Fix be using an event driven approach with rxjs
    */

    /* on destroy not required here bcause it is built into the api. */
    this.http
      .get<{ msg: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            message: post.message,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdate$.next([...this.posts]);
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
        const post: Post = {
          id: responseData.postId,
          title: postTitle,
          message: postMessage,
          imagePath: responseData.imagePath
        };
        this.posts.push(post);
        this.postsUpdate$.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  /* No file image post update (JSON format) */
  addPostOld(postTitle: string, postMessage: string) {
    const post: Post = { id: null, title: postTitle, message: postMessage, imagePath: null };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdate$.next([...this.posts]);
        /*TODO: Refactor to method. Redirect back to post-list page when done */
        this.router.navigate(['/']);
      });
  }

  /* used for the edit form */
  updatePost(postId: string, postTitle: string, postMessage: string, image: File | string) {
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: one-variable-per-declaration
    let postData: Post | FormData;

    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('title', postTitle);
      postData.append('message', postMessage);
      postData.append('image', image, postTitle);
    } else {
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
        /* Now update the local array, this.posts with the newPost - BUT NOW:
          Note: If we never vist our posts list page then there is nothing in the array
          and updatedPosts is empty - so this will fail!
        */
        const updatedPosts = [...this.posts];
        const postIndex = updatedPosts.findIndex(p => p.id === postId);
        const newPost: Post = {
          id: postId,
          title: postTitle,
          message: postMessage,
          imagePath: '' // TODO: WIP - response.imagePath
        };

        updatedPosts[postIndex] = newPost;
        this.posts = updatedPosts;
        this.postsUpdate$.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        /* update posts[] list by just removing one with postId */
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdate$.next([...this.posts]);
      });
  }
}
