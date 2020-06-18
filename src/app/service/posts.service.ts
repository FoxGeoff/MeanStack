import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate$ = new Subject<Post[]>();

  constructor() { }

  getPosts() {
    /* using a array copy, this is GOOD
    *  but creates an issue
    *  Fix use an event driven approach rxjs
    */
    return [...this.posts];
  }

  addPost(postTitle: string, msg: string) {
    const post: Post = {title: postTitle, message: msg};
    this.posts.push(post);
    this.postsUpdate$.next([...this.posts]);
  }
}
