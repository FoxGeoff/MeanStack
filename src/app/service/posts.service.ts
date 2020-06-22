import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

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
    *  Fix use an event driven approach rxjs
    */

    // on destroy not required here. Built into api.
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) => {
      this.posts = postData.posts;
      this.postsUpdate$.next([...this.posts]);
    });

  }

  getPostUpdate$() {
    return this.postsUpdate$.asObservable();
  }

  addPost(postTitle: string, msg: string) {
    const post: Post = {id: null, title: postTitle, message: msg};
    this.posts.push(post);
    this.postsUpdate$.next([...this.posts]);
  }
}
