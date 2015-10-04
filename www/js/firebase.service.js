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
