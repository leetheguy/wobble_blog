function firebaseService($rootScope, $firebaseObject) {
  var ref  = new Firebase("https://wobble-blog.firebaseio.com/");
  var data = $firebaseObject(ref);
  return data.$loaded();
};

angular.module('wobble-blog')
.service('firebaseService', firebaseService);

firebaseService.$inject = ['$rootScope', '$firebaseObject']

/* global angular Firebase */
