myApp.factory('Authentication', 
    ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth',
    function($rootScope, $location, $firebaseObject, $firebaseAuth) {
        var ref = firebase.database().ref();
        var auth = $firebaseAuth();
        var myObject;
        
        auth.$onAuthStateChanged(function(authUser) {
            if(authUser) {
                var userRef = ref.child('users').child(authUser.uid);
                var userObj = $firebaseObject(userRef);
                $rootScope.currentUser = userObj;
            } else {
                $rootScope.currentUser = '';
            }
        });
        
        myObject = {
            login: function(user) {
                auth.$signInWithEmailAndPassword(user.email, user.password).then(function(user) {
                    $location.path('/meetings');
                }).catch(function(error) {
                    $rootScope.message = error.message;
                }); 
            },
            logout: function() {
                return auth.$signOut();
            },
            requireAuth: function() {
                return auth.$requireSignIn();    
            },
            register: function(user) {
                auth.$createUserWithEmailAndPassword(
                user.email,
                user.password
              ).then(function(regUser) {
                //   store user info
                var regRef = ref.child('users').child(regUser.uid).set({
                    date: firebase.database.ServerValue.TIMESTAMP,
                    regUser: regUser.uid,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                });
                // log user in after registration
                myObject.login(user);
              }).catch(function(error) {
                //   display error
                $rootScope.message = error.message;
              }); //createUserWithEmailAndPassword
            }
        };
        
        return myObject;
    }
    ]);