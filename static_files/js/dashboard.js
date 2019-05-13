// TODO pop up some modal/view to check-in
// Create a standard view a challenge a user is participating in
// Each challenge is a part of a collapsible accordion
function createChallengeView(challenge, i) {
  return `<div class="card">
    <div class="card-header" id="heading${i}">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
          ${challenge.title}
        </button>
      </h5>
    </div>

    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#currentChallenges">
      <div class="card-body">
        <p>${challenge.description}</p>
        <p><b>Participants:</b> ${challenge.participantNames.join(", ")}</p>
        <p><b>Cost:</b> ${challenge.cost} Accounta-Bux</p>
        <p><b>Check-In Time:</b> ${challenge.checkInDeadline} </p>
        <p>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#checkInModal">Check-In</button>
          <button type="button" class="btn btn-secondary" onclick="goToChallengeDetails('${challenge.uid}');">Challenge Details</button>
        </p>
      </div>
    </div>
  </div>`;
}


function displayChallenges() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  // Get currentUser's info from the database
  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let challenges = snapshot.val().challenges;

    // Retrieve each challenge from the database and append it to the challenge view
    challenges.forEach((challenge, i) => {
      database.ref('challenges/' + challenge).once('value').then(function(snapshot) {
        $('#currentChallenges').append(createChallengeView(snapshot.val(), i));
      });
    });
  });

}


function showPosition(position) {
  $('#latitude').attr('value', position.coords.latitude)
  $('#longitude').attr('value', position.coords.longitude)
}


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


function goToChallengeDetails(challengeUID) {
  window.location.href = 'challenges.html?challenge=' + challengeUID;
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
