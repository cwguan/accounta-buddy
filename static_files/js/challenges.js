// TODO pop up some modal/view to check-in
// Create a standard view a challenge a user is participating in
// Each challenge is a part of a collapsible accordion
function createChallengeView(challenge, i) {
  return `<div class="column">
      <h2><b><font color='#7A7A7A'>${challenge.title}</font></b></h2>
      <p>${challenge.description}</p>
      <p><b>Participants:</b> ${challenge.participantNames.join(", ")}</p>
      <p>Check in every day by <b>${challenge.checkInDeadline}</b></p>
      <p>Don't forget, or you owe them <b>${challenge.cost}</b> Accounta-bux!</p>
  </div>`;
}


//depreciated code for checkins button
/*function displayAllCheckins() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  var href = window.location.href;
  var challengeUID = href.split('?challenge=')[1];

  // Get currentUser's info from the database
  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let challenges = snapshot.val().challenges;

    // Retrieve each challenge from the database and append it to the challenge view
    challenges.forEach((challenge) => {
      database.ref('challenges/' + challengeUID + '/checkIns').once('value').then(function(snapshot) {
        getCheckins(snapshot.val());
      });
    });
  });
}

function getCheckins(checkins) {
  var keys = Object.keys(checkins);
  keys.forEach(function(key) {
    $('#challengeInfo').append(`<p><b>Date:</b> ${key}<p>`);
    userKeys = Object.keys(checkins[key]);
    //need to change location in below block with whatever location API thing we have
    userKeys.forEach(function(userKey) {
      $('#challengeInfo').append(`<p><b>Time:</b> ${checkins[key][userKey].checkInTime}</p>
          <p><b>description:</b> ${checkins[key][userKey].description}</p>
          <p><b>location:</b> ${checkins[key][userKey].location.latitude}, ${checkins[key][userKey].location.longitude}</p>
          <p><b>participant:</b> ${checkins[key][userKey].participantName}</p>
          <img src="${checkins[key][userKey].photoURL}" />`);
    });

  });
  console.log(info);
  return info;
}*/

function createCheckIns(currentUser, checkins) {

  checkInDateObjects = checkins.checkIns;
  checkInKeys = Object.keys(checkInDateObjects);
  userKeys = Object.values(checkins.participants);
  checkInKeys.forEach(function(checkInKey) {
    $('#checkinFeed').append(`<li class="list-group-item"><b>${checkInKey}</b></li>`);
    userKeys.forEach(function(userKey, i) {
      if (currentUser == userKey) {
        if (checkInDateObjects[checkInKey][userKey]) {
          $('#checkinFeed').append(`<li class="list-group-item list-group-item-success"><p><b>You</b> checked in for <b>${checkins.title}</b> on ${checkInKey}</p>
          <p><b>description:</b> ${checkInDateObjects[checkInKey][userKey].description}</p>
          <p><b>location:</b> ${checkInDateObjects[checkInKey][userKey].location.latitude}, ${checkInDateObjects[checkInKey][userKey].location.longitude}</p>
          <p><b>participant:</b> ${checkInDateObjects[checkInKey][userKey].participantName}</p>
          <img src="${checkInDateObjects[checkInKey][userKey].photoURL}" /></li>`);
        } else {
          $('#checkinFeed').append(`<li class="list-group-item list-group-item-danger"><b>You</b> missed a check-in for <b>${checkins.title}</b> on ${checkInKey}</li>`);
        }
      } else {
        if (checkInDateObjects[checkInKey][userKey]) {
          $('#checkinFeed').append(`<li class="list-group-item list-group-item-info"><p><b>${checkInDateObjects[checkInKey][userKey].participantName}</b> checked in for <b>${checkins.title}</b> on ${checkInKey}</p>
          <p><b>description:</b> ${checkInDateObjects[checkInKey][userKey].description}</p>
          <p><b>location:</b> ${checkInDateObjects[checkInKey][userKey].location.latitude}, ${checkInDateObjects[checkInKey][userKey].location.longitude}</p>
          <p><b>participant:</b> ${checkInDateObjects[checkInKey][userKey].participantName}</p>
          <img src="${checkInDateObjects[checkInKey][userKey].photoURL}" /></li>`);
        } else {
          $('#checkinFeed').append(`<li class="list-group-item list-group-item-warning"><b>${checkins.participantNames[i]}</b> missed a check-in for <b>${checkins.title}</b> on ${checkInKey}</li>`);
        }
      }


    });
  });


}

function displayChallengeDetails() {
  let currentUser = firebase.auth().currentUser;
  let currentUID = currentUser.uid;
  let database = firebase.database();
  var href = window.location.href;
  var challengeUID = href.split('?challenge=')[1];

  // Get currentUser's info from the database
  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let challenges = snapshot.val().challenges;

    database.ref('challenges/' + challengeUID).once('value').then(function(snapshot) {
      $('#challengeInfo').append(createChallengeView(snapshot.val()));
      createCheckIns(currentUID, snapshot.val());
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
