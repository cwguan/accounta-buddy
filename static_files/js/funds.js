

function getBalance(currentUser){
  let currentUser = firebase.auth().currentUser;
  let currentUID = currentUser.uid;
  let database = firebase.database();
  var href = window.location.href;
  var challengeUID = href.split('?challenge=')[1];

  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let balance = snapshot.val().balance;

    database.ref('challenges/' + challengeUID).once('value').then(function(snapshot) {
      
    });
  });
  $('#challengeInfo').append("current balance: ", balance);
}






$(document).ready(() => {
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});

