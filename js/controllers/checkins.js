myApp.controller('CheckInsController',
  ['$scope', '$rootScope', '$location', '$routeParams', '$firebaseObject', '$firebaseArray',
  function($scope, $rootScope, $location, $routeParams, $firebaseObject, $firebaseArray) {

    
    
    $scope.whichmeeting = $routeParams.mid;
    $scope.whichuser = $routeParams.uid;
    
    var ref, checkinsList;
    
    // get current meeting object
    $scope.currentCheckIn =  $firebaseObject(firebase.database().ref()
      .child('users').child($scope.whichuser)
      .child('meetings').child($scope.whichmeeting));
    
    ref = firebase.database().ref()
      .child('users').child($scope.whichuser)
      .child('meetings').child($scope.whichmeeting)
      .child('checkins');

    checkinsList = $firebaseArray(ref);
    $scope.checkins = checkinsList;  
    
    $scope.order = 'firstname';
    $scope.direction = null;
    $scope.query = '';
    $scope.recordId = '';
    
    $scope.pickRandom = function() {
      var whichRecord = Math.round(Math.random() * (checkinsList.length - 1));
      $scope.recordId = checkinsList.$keyAt(whichRecord);
    };  // pick a random winner
    
    $scope.showLove = function(myCheckin) {
      myCheckin.show = !myCheckin.show;
      
      if(myCheckin.userState == 'expanded') {
        myCheckin.userState = '';
      } else {
        myCheckin.userState = 'expanded';
      }
    };
    
    $scope.giveLove = function(myCheckin, myGift) {
      var refLove = ref.child(myCheckin.$id).child('awards');
      var checkinsArray = $firebaseArray(refLove);
      
      checkinsArray.$add({
        name: myGift,
        date: firebase.database.ServerValue.TIMESTAMP
      });
    }
    
    $scope.deleteLove = function(myCheckin, key) {
      var refLove = ref.child(myCheckin.$id).child('awards').child(key);
      var record = $firebaseObject(refLove);
      record.$remove(key);
    }

    $scope.addCheckin = function() {
      $firebaseArray(ref).$add({
        firstname: $scope.user.firstname,
        lastname: $scope.user.lastname,
        email: $scope.user.email,
        date: firebase.database.ServerValue.TIMESTAMP
      }).then(function() {
        $location.path('/checkins/' + $scope.whichuser + '/' +
        $scope.whichmeeting + '/checkinslist');
      }); //$add
    };//addCheckin
    
    $scope.deleteCheckin = function(id) {
        // refer to check-in
        var refDelete = ref.child(id);
        // save object
        var record = $firebaseObject(refDelete);
        // delete check-in
        record.$remove(id);
    };

}]); //myApp.controller