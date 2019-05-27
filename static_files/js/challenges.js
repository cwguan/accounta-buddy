// Firebase init method to check for logged-in users and displaying the correct content
initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("logged in");
      displayChallengeDetails();
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


// Create a standard view a challenge a user is participating in
// Each challenge is a part of a collapsible accordion
function createChallengeView(challenge, i) {
  return `<div class="column">
      <h2><b><font color='#7A7A7A'>${challenge.title}</font></b></h2>

      <p><b>Description:</b> ${challenge.description}</p>


      <p><b>Participants:</b> ${challenge.participantNames.join(", ")}</p>


      <p><b>Check in: </b> every day by ${challenge.checkInDeadline}</p>


      <p><b>Cost: </b> ${challenge.cost} Accounta-bux</p>


  </div>`;
}


function checkURL(url) {
  if (url == 'someURL') {
    return `<p>No image uploaded<p></li>`;
  } else {
    return `<img class="img-fluid" src="${url}" /></li>`;
  }
}


function createCheckIns(currentUser, checkins) {
  checkInTime = checkins.checkInDeadline;
  var timeSplit = checkInTime.split(":");
  currentTime = parseInt((new Date().getTime()/1000).toFixed(0));
  checkInDateObjects = checkins.checkIns;
  checkInKeys = Object.keys(checkInDateObjects);
  checkInKeys = checkInKeys.reverse();
  userKeys = Object.values(checkins.participants);
  checkInKeys.forEach(function(checkInKey) {
    deadline = parseInt((new Date(checkInKey).getTime() / 1000 + 60*timeSplit[1] + 3600*timeSplit[0] +25200).toFixed(0));
    $('#checkinFeed').append(`<li class="list-group-item"><b>${checkInKey}</b></li>`);
    userKeys.forEach(function(userKey, i) {
      if (currentUser == userKey) {
        if (checkInDateObjects[checkInKey][userKey]) {
          url = checkInDateObjects[checkInKey][userKey].photoURL;
          newInfo = `<li class="list-group-item list-group-item-success">
          <details>
          <summary><p><b>You</b> checked in for <b>${checkins.title}</b> on ${checkInKey}</p></summary>
          <p><b>description:</b> ${checkInDateObjects[checkInKey][userKey].description}</p>

          <p><b>participant:</b> ${checkInDateObjects[checkInKey][userKey].participantName}</p>
          <div class="container-fluid">

          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-lat=${checkInDateObjects[checkInKey][userKey].location.latitude} data-lng=${checkInDateObjects[checkInKey][userKey].location.longitude}>
            Location
          </button>

          <button type="button" onclick="setImageURL('${url}')" class="btn btn-success" data-toggle="modal" data-target="#photoModal">
            Photo
          </button>
         </div>
         <p></p>
         <!--<p><b>location:</b> ${checkInDateObjects[checkInKey][userKey].location.latitude}, ${checkInDateObjects[checkInKey][userKey].location.longitude}</p> --></details>
        </li>
         `;


          // location code if needed
          // <p><b>location:</b> ${checkInDateObjects[checkInKey][userKey].location.latitude}, ${checkInDateObjects[checkInKey][userKey].location.longitude}</p>

          // not needed atm because photo appears in modal
          // Before: showed picture in the expanded card
          //newInfo = newInfo + checkURL(url);

          $('#checkinFeed').append(newInfo);
        } else {
          if(currentTime > deadline) {
            $('#checkinFeed').append(`<li class="list-group-item list-group-item-danger"><b>You</b> missed a check-in for <b>${checkins.title}</b> on ${checkInKey}</li>`);
          }
        }
      } else {
        if (checkInDateObjects[checkInKey][userKey]) {
          url = checkInDateObjects[checkInKey][userKey].photoURL;
          newInfo = `<li class="list-group-item list-group-item-info">
          <details>
          <summary><p><b>${checkInDateObjects[checkInKey][userKey].participantName}</b> checked in for <b>${checkins.title}</b> on ${checkInKey}</p></summary>
          <p><b>description:</b> ${checkInDateObjects[checkInKey][userKey].description}</p>
          <p><b>participant:</b> ${checkInDateObjects[checkInKey][userKey].participantName}</p>
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" data-lat=${checkInDateObjects[checkInKey][userKey].location.latitude} data-lng=${checkInDateObjects[checkInKey][userKey].location.longitude}>
          Location
          </button>

          <button type="button" onclick="setImageURL('${url}')" class="btn btn-success" data-toggle="modal" data-target="#photoModal">
          Photo
          </button>
          </div>
          <p></p></details>
          </li>
          `;

          // location code
          // <p><b>location:</b> ${checkInDateObjects[checkInKey][userKey].location.latitude}, ${checkInDateObjects[checkInKey][userKey].location.longitude}</p>


          // not needed atm because photo appears in modal
          // Before: showed picture in the expanded card

          //newInfo = newInfo + checkURL(url);

          $('#checkinFeed').append(newInfo);
        } else {
          if (currentTime > deadline) {
            $('#checkinFeed').append(`<li class="list-group-item list-group-item-warning"><b>${checkins.participantNames[i]}</b> missed a check-in for <b>${checkins.title}</b> on ${checkInKey}</li>`);
          }

        }
      }


    });
  });
}


function setImageURL(url) {
  console.log('here', url);
  if (url == 'someURL') {
    $('#image').html(`<p>No image uploaded<p>`);
  } else {
    $('#image').html(`<img class="img-fluid" src="${url}" />`);
  }
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
  // define a generic Ajax error handler:
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
