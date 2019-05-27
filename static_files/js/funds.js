

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






$(document).ready(() => {
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});

