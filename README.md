# Project: MeanStack

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## Safari Angular and Node.js - The MEAN Stack Guide

## Task: Add: Material

* Run: ```ng add @angular/material```
* Task: Add: Material Module
* Export all the mat components
* Import material.module ine app.module
* Restart VSCode to see the results

### Using #textArea (template var) to set var  

* onAddPost(postTextarea: HTMLTextAreaElement)
* Use Console.dir(postTextarea) to read all DOM element metadata

### Using two way binding [(ngModel)]

* app.model

```JavaScript
import { FormsModule } from '@angular/forms';
```

* Template:

```html
 <textarea [(ngModel)] = "enteredValue"></textarea>
```

* Code

```JavaScript
newPost=''; //property
...

onAddPost(postTextarea: HTMLTextAreaElement) {
    this.newPost = this.enteredValue;
```

## Task: Add mat toolbar

## Task: Add: mat expansion panel

* styling mat card in post-create component and mat expansion in post-list component

```css post-create
.container
 {
   margin: 20px;
   width: 300px;
 }
```

```css post-list
 :host {
   display: block;
   margin-top: 1rem;
 }
```

## Task: Add: Test posts

## Task: Add: User input Title and Message

## Task: Creating Posts with Property & Event Binding

* Task: Add: the new post to posts[] @Output()
* Step #1: On raised event, @Output() postCreated to parent (app.component)

```JavaScript
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
...
export class PostCreateComponent implements OnInit {
   @Output() postCreated = new EventEmitter<Post>(); //***
...
onAddPost() {
    const newPost = {
      message: this.enteredMessage,
      title: this.enteredTitle
    };

    console.log(`Title: ${newPost.title} Message: ${newPost.message}`);

    this.postCreated.emit(newPost); //***
  }
```

```html
<main class="main">
  <div class="create">
    <app-post-create (postCreated)="onPostAdded($event)"></app-post-create>
  </div>

  <div class="list">
    <app-post-list [posts] = "storedPosts"></app-post-list>
  </div>
</main>
```

* Step #2: take storedPosts from the (parent: app.component) and @Intput() posts (child: component post-list)

```JavaScript
export class PostListComponent implements OnInit {
  @Input() posts: Post[] = [];
```

```JavaScript
export class AppComponent {
  title = 'MeanStack';
  storedPosts: Post[] = [];

  onPostAdded(post: Post) {
    this.storedPosts.push(post);
  }
}
```

## Task: Adding forms (no validation yet!)

* Use: ```<form class="form" #postForm="ngForm" (submit)="onAddPost(postForm)">```
* Use: ```<input matInput type="text" name="title" ngModel/>```
* Use: ```<button type="submit" [disabled]="!postForm.form.valid">Save</button>```

```html
<form class="form" #postForm="ngForm" (submit)="onAddPost(postForm)">
    <mat-form-field class="full-width">
      <mat-label>Post title</mat-label>
      <input matInput type="text" name="title" ngModel/>
    </mat-form-field>

    <mat-form-field class="full-width" appearance="fill">
      <mat-label>Post message here...</mat-label>
      <textarea matInput rows="4" name="message" ngModel></textarea>
    </mat-form-field>

    <p>
      <button
        mat-raised-button
        color="accent"
        type="submit"
        [disabled]="!postForm.form.valid"
      >
        Save Post
      </button>
    </p>
  </form>
  ```

  ```JavaScript
  onAddPost(form: NgForm) {
    const post = {
      title: form.value.title,
      message: form.value.message
    };

    console.log(`Title: ${post.title} Message: ${post.message}`);

    this.postCreated.emit(post);
  }
  ```

  ##Task: Add: Form validation error messages

* (note: ngModel AND #msgVar="ngModle" used)

  ```html
  <mat-form-field class="full-width" appearance="fill">
      <mat-label>Post message here...</mat-label>
      <textarea matInput rows="4" name="message" required ngModel #msgVar="ngModel"> </textarea>
      <mat-error *ngIf="msgVar.invalid">Title required</mat-error>
  </mat-form-field> ```

## Task: Add: PostService

* Register service in app.module ``providers:[postservice]
* OR register using (both will create a Singleton at the root level)

```JavaScript
@Injectable({
  providedIn: 'root'
})
```

## Task: Calling GET Post (observables) Subject emit

* Replacing "emit" with rxjs "Subject"

```JavaScript
private postsUpdate$ = new Subject<Post[]>();
...
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate$ = new Subject();
...
getPostUpdate$() {
    return this.postsUpdate$.asObservable();
  }
...
addPost(postTitle: string, msg: string) {
    const post: Post = {title: postTitle, message: msg};
    this.posts.push(post);
    this.postsUpdate$.next([...this.posts]);
  }  
```

* Task: Calling GET Post (observables) Subscribe & ngOnDestroy

```JavaScript
export class PostListComponent implements OnInit, OnDestroy{
...
constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postSubscription = this.postsService.getPostUpdate$()
      .subscribe(
        (posts: Post[]) => { this.posts = posts; });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }  

```

## Adding a node + Express Backend

## Task: Add server.js

```JavaScript
// node server.js (not in package.json)
// npm install nodemon --save-dev
// npm run start:server ("start:server":nodemon server.js) ISSUE!
// FIX: nodemon server.js (in dir src)
const http = require("http");
const app = require("../backend/app");

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    //named pipe
    return val;
  }

  if (port >= 0) {
    //port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is aready in use");
      process.exist(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.debug("listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
```

* The backend/app.js file

```JavaScript
// node server.js (not in package.json)
// npm install nodemon --save-dev
// npm run start:server ("start:server":nodemon server.js) ISSUE!
// FIX: nodemon server.js (in dir src)
const http = require("http");
const app = require("../backend/app");

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    //named pipe
    return val;
  }

  if (port >= 0) {
    //port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is aready in use");
      process.exist(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.debug("listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
```

## Task: Fetching Initial Posts

```JavaScript
app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "12345",
      title: "First server-side post",
      message: "This is coming from the server",
    },
    {
      id: "12355",
      title: "Second server-side post",
      message: "This is also coming from the server",
    },
  ];
  // just by being the last in the chain it is returned.
  return res.status(200).json({
    msg: "Posts feched succesfully!",
    posts: posts,
  });
});

module.exports = app;
```

## Task: Allowing CORS

```JavaScript
// npm install express --save
// this is the express framework app
const express = require("express");
const bodyParser = require("body-parser"); // for post

const app = express();

app.use(bodyParser.json()); //for post
app.use(bodyParser.urlencode({ extended: false })); //for url encoded post

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Conten-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});
```

## Task: Adding the POST Backend Point

* Run:```npm install body-parser --save```

* app.js:

```JavaScript
const bodyParser = require("body-parser");
...
app.use(bodyParser.json());
...
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    msg: "Post added sucessfully";
  });
});
```

## Task: Setting up MongoDB

## Task: Setting up Mongoose
