// Object mapping to be able to set the right file name in Storage
var mimeTypeToExtension = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/tiff": "tiff",
  "image/vnd.wap.wbmp": "wbmp",
  "image/x-icon": "ico",
  "image/x-jng": "jng",
  "image/x-ms-bmp": "bmp",
  "image/svg+xml": "svg",
  "image/webp": "webp"
};

let currentImage = {};


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
        };

        reader.readAsDataURL(input.files[0]);
        // Saves Blob, not the data, & the extension
        currentImage.file = input.files[0]
        currentImage.extension = mimeTypeToExtension[currentImage.file.type];
    }
}

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
          <button type="button" class="btn btn-primary" onclick="setCheckInChallenge('${challenge.uid}');" data-toggle="modal" data-target="#checkInModal">Check-In</button>
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


// Set the onclick of the submit check-in button to be with the right chalelnge uid
function setCheckInChallenge(challengeUID) {
  $('#submitCheckInBtn').attr('onclick', `submitCheckIn('${challengeUID}');`);
}


// Submit the check-in for the currentUser and displayed challenge
// TODO: validate form input, check for empty, etc.
function submitCheckIn(challengeUID) {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  var storageRef = firebase.storage().ref();
  //for use in checking if already submitted a checkin
  //var existingCheckin = false;


  // Get form input
  let description = $('#description').val();
  let location = {
    'latitude': $('#latitude').val(),
    'longitude': $('#longitude').val()
  };

  // Extract only the YYYY-MM-DD from Date object
  let date = new Date().toISOString();
  date = date.substring(0, 10);

  var uploadTask = storageRef.child(`${challengeUID}/${date}/${currentUser.uid}.${currentImage.extension}`).put(currentImage.file);
  uploadTask.on('state_changed', function(snapshot) {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }

  }, function(error) {
    // Handle unsuccessful uploads
    console.log(error);

  }, function() {
    // Handle successful uploads on complete
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      // Once image has been uploaded to Storage, create entry in Realtime Database

      let update = {
        participantName: currentUser.displayName,
        checkInTime: getCurrentTime(),
        description: description,
        photoURL: downloadURL,
        location: location,
      };

      database.ref('challenges/' + challengeUID + '/checkIns/' + date + '/' + currentUser.uid).update(update);

    });
  }); // End of Storage uploadTask state_changed handling

  //code for updating user money
  var cost = [];
  var otherUsers = [];
  var checkedIn = false;
  database.ref('challenges/' + challengeUID).once('value').then(function(snapshot) {

    let users = Object.values(snapshot.val().participants);
    for (const user of users) {
      if (user != currentUser.uid) {
        otherUsers.push(user);
      }
    }
    cost = snapshot.val().cost;
    database.ref('users/' + currentUser.uid + '/balance').once('value').then(function(snapshot) {
      let currentBalance = snapshot.val() + cost * otherUsers.length;
      database.ref('users/' + currentUser.uid + '/balance').set(currentBalance);
    });
    for (const otherUser of otherUsers) {
      database.ref('users/' + otherUser + '/balance').once('value').then(function(snapshot) {
        let tempBalance = snapshot.val() - cost;
        database.ref('users/' + otherUser + '/balance').set(tempBalance);
      });
    }
  });
}


// Gets time in HH:DD in correct format for database
function getCurrentTime() {
  let currentTime = new Date();
  let checkInTime = "";
  if (currentTime.getHours() < 10) {
    console.log(currentTime.getHours())
    checkInTime = "0" + currentTime.getHours() + ":";
  } else {
    checkInTime = currentTime.getHours() + ":";
  }

  if (currentTime.getMinutes() < 10) {
    checkInTime = checkInTime + "0" + currentTime.getMinutes();
  } else {
     checkInTime = checkInTime + currentTime.getMinutes();
  }

  return checkInTime;
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
