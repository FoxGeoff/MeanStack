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
    /* using a array copy, this is GOOD
    *  but creates an issue
    *  Fix be using an event driven approach with rxjs
    */

    // on destroy not required here bcause it is built into the api.
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

  getPostUpdate$() {
    return this.postsUpdate$.asObservable();
  }

  addPost(postTitle: string, msg: string) {
    const post: Post = { id: null, title: postTitle, message: msg };
    this.http.post<{ msg: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responData) => {
        console.log(responData.msg);
        this.posts.push(post);
        this.postsUpdate$.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdate$.next([...this.posts]);
      });
  }
}
