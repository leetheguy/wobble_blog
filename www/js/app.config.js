function router($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    template: '<p>Hello, world!</p>'
  });
}

angular.module('wobble-blog')
.config(router);

router.$inject = ['$stateProvider', '$urlRouterProvider'];

/* global angular */
