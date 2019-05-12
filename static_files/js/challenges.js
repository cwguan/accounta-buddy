// TODO pop up some modal/view to check-in
// Create a standard view a challenge a user is participating in
// Each challenge is a part of a collapsible accordion
function createChallengeView(challenge, i) {
  return `<div class="column">
      <h2><b>${challenge.title}</b></h2>
      <p>${challenge.description}</p>
      <p><b>Participants:</b> ${challenge.participantNames.join(", ")}</p>
      <p>Check in every day by ${challenge.checkInDeadline}</p>
      <p>Don't forget, or you owe them ${challenge.cost} Accounta-bux!</p>
      <button type="button" class="btn btn-outline-dark"  onclick="displayAllCheckins(); this.style.display = 'none'">See All Checkins</button>
  </div>`;
}

function displayAllCheckins() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  var href = window.location.href;
  var challengeUID = href.split('?challenge=')[1];

  // Get currentUser's info from the database
  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let challenges = snapshot.val().challenges;
    console.log(challenges);

    // Retrieve each challenge from the database and append it to the challenge view
    challenges.forEach((challenge) => {
      database.ref('challenges/' + challengeUID + '/checkIns').once('value').then(function(snapshot) {
        console.log(snapshot.val());
        $('#challengeInfo').append(getCheckins(snapshot.val()));
      });
    });
  });
}

function getCheckins(checkins) {
  return `<p><b>${checkins.checkInTime}</b></p>
      <p><b>description:</b> ${checkins.description}</p>
      <p><b>location:</b> ${checkins.location}</p>
      <p><b>participant:</b> ${checkins.particpantName}</p>
      <img src=${checkins.photoURL}`;
}

function displayChallengeDetails() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  var href = window.location.href;
  var challengeUID = href.split('?challenge=')[1];

  // Get currentUser's info from the database
  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let challenges = snapshot.val().challenges;
    database.ref('challenges/' + challengeUID).once('value').then(function(snapshot) {
      $('#challengeInfo').append(createChallengeView(snapshot.val()));
    });
  });

}






$(document).ready(() => {
  // // TODO Currently pretending Chris (uid:1) is logged in, will need to update current logged in user
  // $.ajax({
  //     url: 'challenges/1',
  //     type: 'GET',
  //     dataType : 'json',
  //     success: (data) => {
  //       console.log('Received challenges for user 1');
  //       const dataKeys = Object.keys(data);
  //       dataKeys.forEach((challenge, i) => {
  //         $('#currentChallenges').append(createChallengeView(data[challenge], i));
  //       });
  //     },
  //   });

  // define a generic Ajax error handler:
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
