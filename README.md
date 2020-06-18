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

```JavaScript
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
...
export class PostCreateComponent implements OnInit {
   @Output() postCreated = new EventEmitter(); //***
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
