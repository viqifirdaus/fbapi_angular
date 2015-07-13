angular.module('plunker', [ 'ngFacebook'])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('845461152157850');
  $facebookProvider.setPermissions("email,user_likes,user_posts,user_location,user_birthday,user_photos,read_mailbox,publish_actions");
  $facebookProvider.setVersion("v2.3");
})

.run( function( $rootScope ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
})

.controller('DemoCtrl', ['$scope', '$facebook', function($scope, $facebook){
  //$scope.isLoggedIn = true;
  getStatus();

  $scope.login = function() {
    $facebook.login().then(function() {
      refresh();
    });
  }

  $scope.logout = function() {
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      $scope.welcomeMsg = "Please log in";
    });
  }

  function refresh() {
    $facebook.api("/me", {fields: 'feed,name,email,quotes,gender,birthday,location,photos,inbox'}).then( 
      function(response) {
        //$scope.welcomeMsg = response;
        $scope.name = response.name;
        $scope.quotes = response.quotes;
        $scope.email = response.email;
        $scope.gender = response.gender;
        $scope.birthday = response.birthday;
        $scope.location = response.location;
        $scope.feed = response.feed;
        $scope.photos = response.photos.data;
        $scope.messages = response.inbox.data;

        $scope.isLoggedIn = true;
        
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }

  function getStatus(){
    if ($facebook.getLoginStatus()) {
      //$scope.isLoggedIn = true;
      refresh();
    }else{
      $scope.welcomeMsg = "Please log in";
      $scope.isLoggedIn = false;
    }
  }

  $scope.postit = function(){
    $facebook.api('/me/feed', 'post', { message: $scope.posting }).then( 
      function(response) {
        alert('Succes!');
        $scope.posting = '';
        refresh();
      },
      function(err) {
        alert(err);
        $scope.posting = err;
      });
  }
}])

;
