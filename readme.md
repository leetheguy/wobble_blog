# How To Create a Serverless Blog With Ionic, Angular, and Firebase


[https://www.youtube.com/watch?v=FOtDNXfMyD0]

---
## Introduction
I created Wobble Blog to host my own personal blog featuring front end only technology and more specifically jIonic, Angular, and Firebase - three great technologies that play great together.
Then I blogged about creating my blog on the blog I created to blog about creating this blog.

This article is aimed towards beginners but it assumes an understanding of basic front-end web development concepts and practices including HTML, CSS, JS, Angular, and Git.
If you’re struggling with any of these concepts, you can brush up your skills at [freeCodeCamp](http://freecodecamp.com/) and [thinkster.io](https://thinkster.io/).
If all you need is an Angular crash course, [this is a great one](https://www.airpair.com/angularjs/posts/angularjs-tutorial).

Here are the advantages I’ve found in using this stack:

* [Angular](https://angularjs.org/)

   The most popular front-end framework.
   Angular directives breathe life into your HTML elements making them functional and interactive.
   Provides 2-way data binding so that changes in the browser are represented in your code and vice-versa without having to write hundreds of lines of spaghetti code querying the DOM.
   Enforces a strict structure creating better organization within and consistency between apps.

* [Ionic](http://ionicframework.com/)

   More than just another HTML templating system, Ionic is also a fully functional Node server that greatly simplifies setting up your development environment.
   Packaging your web app for native mobile deployment is baked right in.
   The interface provides native look and feel for mobile environments creating a higher quality experience for your users.
   Cordova is baked right in allowing you access to mobile only features like the accelerometer, GPS, etc.
   Uses Angular as its logic layer.

* [Firebase](https://www.firebase.com/)

   A simple yet powerful Restful API based datastore.
   No vendor lock-in.
   Provides auth logic and other great tools like the GeoLocation plugin.
   Has amazing integration with Angular via Angularfire.
   Provides not 1, not 2, but 3-way data binding so any changes made in your interface are automatically represented in your code and datastore; in most cases eliminating the need for push notifications.

---
## Requirements
Considerations for this blog:

* The Blog should should have posts.
 * Posts should be taggable.
 * Posts should have a visibility flag.
 * Posts should have a title, content, and a date.
 * Posts should have access to images saved in the datastore.
* The User should be able to navigate between posts with previous and next buttons.
* The User should be able to search the blog.
* The User should be able to find posts by tag.
* The Blog should support markdown.
* The Blog should have an archive section with a list of all posts.
* The Blog should have auth logic for administration.
* The Blog should be accessible as a native app.

---
## Basic Environment and Installation
Now that we have our minimal specs, let’s set up our environment.

For simplicity and consistency of implementation I’m going to use The [Cloud 9 IDE](https://c9.io/).
I also chose C9 because it runs faster and uses less memory on my old laptop.

From your C9 dashboard select “Create a new workspace”.
Name your blog, select Custom as your template, and click “Create workspace”.

__IMPORTANT!__ When installing Ionic on Cloud 9 be sure to select the IP address and not localhost or you’re going to have a bad time.

From the C9 terminal, run these commands to install Ionic:
```javascript
$ npm install -g cordova ionic gulp #select no when asked to create an ionic.io account
$ cd ..
$ ionic start workspace blank
$ cd workspace
$ ionic setup sass
$ ionic serve -dp $PORT
```

If your files appear to be missing click the gear in the file list and select `Refresh File Tree`.
Next expand the `www` folder.
Right click `index.html` and select `Preview`.

BLAM! Your ionic app is up and running.

If you want, you can find the line that says `Ionic Blank Starter` and change it to `Hello World` to make this like every other tutorial on the web.

---
## A Little Bit of Configuration
Let’s setup C9 to run ionic by default.
Click the gear in the upper right hand corner of the window.
Click `Run Configurations` on the left.
Select `Add New Config`.
In the lower tab area a connection tab will open.
Change the name to `ionic` and for the command, add:

    ionic serve -dp $PORT

Now select ionic from the list of `Run Configurations`.
Then click `Set As Default`.
Now whenever you hit `Run Project` on the top bar or press `F5` your ionic server will fire up.

Let’s get a running preview of our app.
Unfortunately C9 doesn’t support Ionic’s livereload implementation so we’ll have to settle for the preview built in to C9 which does well for HTML but may require a refresh for JS and Angular changes.
If you haven’t already, preview the `index.html` file in the `www` directory and select `Preview`.
Then double-click `index.html` to edit it.
Right click the Preview tab and select `Split Pane In Two Columns`.
Resize the preview pane to 320 pixels wide to get a good preview of what your app will look like on the smallest average smartphone.

---
## Understanding Your File Structure
All the files for your website are under `www`.
This is a static site with a simple structure.
The folders should be self explanatory.

Ionic uses [gulp.js](http://gulpjs.com/) to generate CSS from SCSS.
Gulp takes files from `/scss`, renders them, and puts them into `/www/css`.
As that’s the case, you shouldn't touch the `style.css` file directly as this is generated automatically by gulp but instead work with files in `/scss`.
This would also be true for js files if you were using Coffeescript and html files if you were using Jade.
As it stands though, it’s safe to edit your js and html files directly.
In the future I’ll no longer tell you where to go to find files.

---
## Using Best Practices
In this tutorial we’ll be following the recommendations laid out in [johnpapa’s Angular Style Guide](https://github.com/johnpapa/angular-styleguide).
Let’s start by cleaning up the `app.js` file and renaming the app:
```javascript
angular.module('wobble-blog', ['ionic'])
.run(appRun);

/* global angular appRun */
```

Now create a file called app.run.js:
```javascript
function appRun($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
};

appRun.$inject = ['$ionicPlatform'];
/* global cordova StatusBar */
```

The global statements at the end of each file are for C9’s JS validation.
Don’t forget to change the app name in your index.html file.

    <body ng-app="wobble-blog">

---
## Data Structure
If you’re coming from a Rails or PHP background you may be expecting to set up a collection of tables and link them up.
Firebase is a non-relational database though.
And we’re going to try to forget concepts like tables and normalization.
Non-relational databases usually store data as a tree and rely on the code to reduce data errors caused by denormalized data.
Fortunately we can forget all that noise because a blog is read-only by everyone except the administrators.
So here’s our data tree:

* posts
 * post
  * publish_date
  * visible
  * title
  * content
  * tags
   * submarine
   * filbert
   * nilknarf
 * post ...
 * post …
* images
 * walrus
  * image binary
 * chopsticks
  * image binary
 * molecule
  * image binary

That’s it. Dead simple.
I’m not even going to create data for the user.
Since I’ll be the only one administering it, I’ll be hardcoding that in.

---
## Communicating With Firebase
In order to communicate with firebase you’ll need to create a firebase account and a new database for your blog.
I’ll wait here while you go knock that out.

Because the app is so simple and the data stored will be very light, we’re going to use Angularfire’s 3-way data binding for the whole thing.
It’s not recommended to do this for massive or deep data stores but it will likely be years before this blog becomes too complex, if ever.

Let’s create a service in a file called firebase.service.js and attach it to our app:

```javascript
function firebaseService($rootScope, $firebaseObject) {
};

angular.module('wobble-blog')
.service('firebaseService', firebaseService);

firebaseService.$inject = ['$rootScope', '$firebaseObject']

/* global angular Firebase */
```

We’re injecting the `$rootScope` into the service so we can broadcast to the entire app.
We should be injecting `$firebaseArray` because we’re accessing a list of blog posts, but because the data will be light and simple I’m going to use `$firebaseObject` as it’s easier to work with.

Inside the `firebaseService` function add the following lines to tell the app where to find your data.
Make sure to change the URL to your own datastore.
Wobble-blog is mine and you can’t have it:

```javascript
var ref  = new Firebase("https://wobble-blog.firebaseio.com/");
var data = $firebaseObject(ref);
```

Now let’s load the data and tell the rest of the app the happy news as soon as that data is available.

```javascript
  data.$loaded($rootScope, 'data').then(broadcast);
  
  function broadcast(data) {
    $rootScope.$broadcast('data ready', data);
  }
```

We’re using `$broadcast` instead of loading data into each controller to avoid creating duplicate code.
Normally you’d break down the data into smaller chunks and broadcast the pieces as they are loaded.

All together now:

```javascript
function firebaseService($rootScope, $firebaseObject) {
  var ref  = new Firebase("https://wobble-blog.firebaseio.com/");
  var data = $firebaseObject(ref);
  
  data.$loaded().then(broadcast);
  
  function broadcast(data) {
    $rootScope.$broadcast('data ready', data);
  }
};

angular.module('wobble-blog')
.service('firebaseService', firebaseService);

firebaseService.$inject = ['$rootScope', '$firebaseObject']

/* global angular Firebase */
```

## Setting Up Routes
