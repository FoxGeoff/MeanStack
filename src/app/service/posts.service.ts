import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  constructor() { }

  getPosts() {
    // using a array copy
    return [...this.posts];
  }

  addPost(postTitle: string, msg: string) {
    const post: Post = {title: postTitle, message: msg};
    this.posts.push(post);
  }
}
