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
}
```
