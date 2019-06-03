initApp = function() {
 firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
     console.log("logged in");
   } else {
     // User is signed out, display correct content
     console.log("not logged in");
     window.location = '/login.html';
   }
 }, function(error) {
   console.log(error);
 });
};
window.addEventListener('load', function() {
 initApp();
});

function updateBalance5(){
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  let change = 5;
  database.ref('users/' + currentUser.uid + '/balance').once('value').then(function(snapshot) {
    let newBalance = snapshot.val() + change;
    database.ref('users/' + currentUser.uid + '/balance').set(newBalance);
    $('#userBalance').html(`<p><b>Current balance:</b> ${newBalance}</p>`);
  });

}
function updateBalance10(){
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  let change = 10;
  database.ref('users/' + currentUser.uid + '/balance').once('value').then(function(snapshot) {
    let newBalance = snapshot.val() + change;
    database.ref('users/' + currentUser.uid + '/balance').set(newBalance);
    $('#userBalance').html(`<p><b>Current balance:</b> ${newBalance}</p>`);
  });

}






$(document).ready(() => {
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});
