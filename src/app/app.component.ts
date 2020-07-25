import { Component, OnInit } from '@angular/core';
import { Post } from './models/post';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'MeanStack';
  storedPosts: Post[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.autoAuthUser();
  }

  onPostAdded(post: Post) {
    this.storedPosts.push(post);
  }

}
