import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate$ = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

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
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdate$.next([...this.posts]);
      });
  }

  /* used for the edit form */
  getPost(id: string) {
    /* expands the post object and makes a copy to return */
    return { ...this.posts.find(p => p.id === id) };
  }

  getPostUpdate$() {
    return this.postsUpdate$.asObservable();
  }

  addPost(postTitle: string, postMessage: string) {
    const post: Post = { id: null, title: postTitle, message: postMessage };
    this.http.post<{ msg: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responData) => {
        console.log(responData.msg + '::' + responData.postId);
        const id = responData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdate$.next([...this.posts]);
      });
  }

  /* used for the edit form */
  updatePost(postId: string, postTitle: string, postMessage: string) {
    const newPost: Post = { id: postId, title: postTitle, message: postMessage };
    this.http
      .put(`http://localhost:3000/api/posts/${postId}`, newPost)
      .subscribe(response => {
        console.log(response);
        /* Now update the local array, this.posts with the newPost*/
        const updatedPosts = [...this.posts];
        const postIndex = updatedPosts.findIndex(p => p.id === newPost.id);
        updatedPosts[postIndex] = newPost;
        this.posts = updatedPosts;
        this.postsUpdate$.next([...this.posts]);
        /* Now update the sever array */
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
