# Github Project : MeanStack

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## **Kanban Project: Safari Angular and Node.js - The MEAN Stack Guide**

## **Kanban Task #2: The Angular Frontend - Understanding the Basics**

## Task: Add: Material

- Run: `ng add @angular/material`
- Task: Add: Material Module
- Export all the mat components
- Import material.module ine app.module
- Restart VSCode to see the results

### Using #textArea (template var) to set var

- onAddPost(postTextarea: HTMLTextAreaElement)
- Use Console.dir(postTextarea) to read all DOM element metadata

### Using two way binding [(ngModel)]

- app.model

```JavaScript
import { FormsModule } from '@angular/forms';
```

- Template:

```html
<textarea [(ngModel)]="enteredValue"></textarea>
```

- Code

```JavaScript
newPost=''; //property
...

onAddPost(postTextarea: HTMLTextAreaElement) {
    this.newPost = this.enteredValue;
```

## Task: Add mat toolbar

## Task: Add: mat expansion panel

- styling mat card in post-create component and mat expansion in post-list component

```css post-create
.container {
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

- Task: Add: the new post to posts[] @Output()
- Step #1: On raised event, @Output() postCreated to parent (app.component)

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
    <app-post-list [posts]="storedPosts"></app-post-list>
  </div>
</main>
```

- Step #2: take storedPosts from the (parent: app.component) and @Intput() posts (child: component post-list)

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

- Use: `<form class="form" #postForm="ngForm" (submit)="onAddPost(postForm)">`
- Use: `<input matInput type="text" name="title" ngModel/>`
- Use: `<button type="submit" [disabled]="!postForm.form.valid">Save</button>`

```html
<form class="form" #postForm="ngForm" (submit)="onAddPost(postForm)">
  <mat-form-field class="full-width">
    <mat-label>Post title</mat-label>
    <input matInput type="text" name="title" ngModel />
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

## Task: Add: Form validation error messages

- (note: ngModel AND #msgVar="ngModle" used)

  ````html
  <mat-form-field class="full-width" appearance="fill">
    <mat-label>Post message here...</mat-label>
    <textarea
      matInput
      rows="4"
      name="message"
      required
      ngModel
      #msgVar="ngModel"
    >
    </textarea>
    <mat-error *ngIf="msgVar.invalid">Title required</mat-error>
  </mat-form-field>
  ```
  ````

## Task: Add: PostService

- Register service in app.module ``providers:[postservice]
- OR register using (both will create a Singleton at the root level)

```JavaScript
@Injectable({
  providedIn: 'root'
})
```

## Task: Calling GET Post (observables) Subject emit

- Replacing "emit" with rxjs "Subject"

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

- Task: Calling GET Post (observables) Subscribe & ngOnDestroy

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

## **Kanban Task #3: Adding NodeJS to our Project**

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

- The backend/app.js file

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

## Task: Adding Express Framework

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

- Run:`npm install body-parser --save`

- app.js:

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

## **Kanban Task #4: Working with MongoDB**

## Task: Setting up MongoDB

## Task: Setting up Mongoose

- Run: `npm install mongoose --save`

## Task: Understanding Mongoose Schemas & Models

- Add: backend model "post.js"

## Task: Creating a POST Instance

## Task: Connecting our Node Express App to MongoDB

## Task: Storing Data in a Database

- Storing Data in a Database (DB Query)
- Check Database using shell
- MongoDB Shell login - Check on database collection:

![MongoDB](/mongoDB.jpg)

## Task: Fetching Data From a Database

Fake posts not from database:

```JavaScript
app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "1aSz345",
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
    msg: "Posts fetched succesfully!",
    posts: posts,
  });
});

module.exports = app;
```

From the Database:

```JavaScript
app.get("/api/posts", (req, res, next) => {
  //mongoose
  Post.find().then(documents => {
    console.log(documents);
  });
  res.status(200).json({
    msg: "Posts fetched successfully!",
    posts: documents
  });
});

module.exports = app;
```

Check in server terminal:

![MongoDB](/mongoDB-from-db.jpg)

- BUT THIS ERRORS BECAUSE IT IS async FIX by moving code inside "then" block
- Task: Fix error move code inside then block (\_id to id not yet mapped)

```JavaScript
app.get("/api/posts", (req, res, next) => {
  //mongoose
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      msg: "Posts fetched successfully!",
      posts: documents
    });
  });

});

module.exports = app;
```

## Task: Transforming Response Data ( \_id => id )

```JavaScript
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
```

## Check the fix for the error

Checked: In Browser @ localhost:3000/api/posts:

```Json
{
  "msg":"Posts feched successfully!",
  "posts":[
    {"_id":"5ef3cfd9f45c2457b8d67d93",
    "title":"Save new to database",
    "message":"save to database ( Test )",
    "__v":0
    }
  ]
}
```

## Task: Deleting Documents

- backend/app.js

```JavaScript
app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  res.status(200).json({ msg: "Post deleted!" });
});
```

- postService.ts

```typeScript
deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
     .subscribe(() => {
       console.log('Deleted!');
     });
  }
```

- post-list.component.ts

```TypeScript
onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
```

- html

```html
<button mat-button color="warn" (click)="onDelete(post.id)">
  DELETE
</button>
```

- Check result:

```json
Connected to database!
5ef3cfd9f45c2457b8d67d93
```

## Task: Delete one record in DB

```JavaScript
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ msg: "Post deleted!" });
  });
});
```

## Task: Updating the Frontend after Deleting Posts

```JavaScript
deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        // update posts[] by removing one with postId (fails on a create/delete)
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdate$.next([...this.posts]);
      });
  }
```

## Task: Fix fail on consecutive create/delete post actions

- Error to fix: ```Request URL:http://localhost:3000/api/posts/null```
- Solution onDelete send back the server _id for the post with the msg.
- On the backendserver/app.js:

```JavaScript
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    message: req.body.message,
  });
  console.log(post);
  // generates query to DB
  post.save().then( createPost => {
    res.status(201).json({
      msg: "Post added sucessfully",
      postId: createPost._id // new
    });
  });
});
```

- On the postService.ts file:

```JavaScript
addPost(postTitle: string, msg: string) {
    const post: Post = { id: null, title: postTitle, message: msg };
    this.http.post<{ msg: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responData) => {
        console.log(responData.msg + '::' + responData.postId);
        const id = responData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdate$.next([...this.posts]);
      });
  }
```

## Enhancing the Frontend & Overall App

## **Kanban Task #5: Enhancing the App**

## Task: Adding routing

## Task: Add Menu items

## Task: Creating the “edit” Form

- Task: Finishing the Edit Feature
- on server "GET" one item
- on server "PUT" _id: req.body.id

## Task: Updating Posts on Server

- Update local posts array
- Update server posts array
- Use server posts array for "edit posts form"
- Use in init async get post from server
- Note: requires on form [ngModel] = post?.title

## Task: Re-Organizing Backend Routes

## Task: Adding Loading Spinners

- Redirect back to post-list page when done
- Add a spinner during loading

## **Kanban Task #6: Adding Image Uploads to our App**

## Task: Adding the File Input Button

- Add Button and input type="file"

## Task: Converting the Form from a Template Driven to a Reactive

## Task: Adding Image Controls to Store the Image

## Task: Adding an Image Preview

## Task: Starting with the Mime-Type Validator (wip)

## Task: Finishing the Image Validator

- Build the validator
- Attach validator to form - only images - no save yet
- Add to form image control if type is image - no save yet

## Task: Adding Server Side Upload

- Run ```npm install multer --save``` Allows the storage of files on the server
- Add: multar to ```route.post("",(req, res, next)) => {...}```

## Task: Uploading Files

- Angular front-end code

## Task: Working with the File URL

## Task: Fetching Images on the Frontend

- add to Post imagePath
- display image

## Task: Updating Posts with Images << here  @ 3:40>>

## **Kanban Task #7:  Adding Pagination**

## Task: Adding the Pagination Component

## Task: Working on the Pagination Backend

- Using ?pagesize=2&page=1 ```console.log(req.query);```  returns: ```{ pagesize: '2', page: '1' }```

## Task: Connecting the Angular Paginator to the Backend

## Task: Fetching Posts Correctly

## Task: Finishing Touches

## **Kanban Task #8: Adding User Authentication**

## Task:Adding the Login Input Fields

- Code up the login and signup forms and add routing
- loading spinner

## Task: Creating the User Model

- Run ```npm install mongoose-unique-validator --save```
- because 'unique' is only used for DB optimization

## Task: Creating a New User Upon Request

- Run ```npm install bcrypt --save```
- to encript the password
- JWT Run ```npm install jsonwebtoken --save``` (6:20)

## Task: Connecting Angular to the Backend

## Task: Reflecting the Token Expiration in the UI
