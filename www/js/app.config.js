function appConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  var home = {
    url: '/',
    templateUrl: 'templates/home.html'
  }

  var posts = {
    url: '/posts',
    templateUrl: 'templates/posts.html'
  }
  
  var post = {
    url: '/post/:titleSlug',
    templateUrl: 'templates/post.html'
  }

  var newPost = {
    url: '/new-post',
    templateUrl: 'templates/new-post.html'
  }

  var editPost = {
    url: '/edit-post',
    templateUrl: 'templates/edit-post.html'
  }
  
  $stateProvider
    .state('home', home);
    
}

appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
/* global angular */
