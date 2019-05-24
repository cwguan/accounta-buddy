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
  let currentUser = firebase.auth().currentUser;
  let haveCheckedIn = false;
  let buddyHasCheckedIn = false;

  // Check if currentUser has checked-in today
  if (challenge.hasOwnProperty('checkIns') &&
      challenge.checkIns.hasOwnProperty(getCurrentDate()) &&
      challenge.checkIns[getCurrentDate()].hasOwnProperty(currentUser.uid)) {
      haveCheckedIn = true;
  }

  // Check if buddy has checked-in today
  let buddyUID;
  challenge.participants.forEach((participant) => {
    if (participant != currentUser.uid) {
      buddyUID = participant;
    }
  });

  if (challenge.hasOwnProperty('checkIns') &&
      challenge.checkIns.hasOwnProperty(getCurrentDate()) &&
      challenge.checkIns[getCurrentDate()].hasOwnProperty(buddyUID)) {
      buddyHasCheckedIn = true;
  }

  // Set the right text, UI elements according to check-in statuses
  let headerColor = '#f5c6cb';
  let checkInBtnText = "Check-In";
  let remindBuddyBtn = buddyHasCheckedIn ? "" :
                      `<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#remindBuddyModal" onclick="sendReminder('${challenge.title}', '${buddyUID}');">Remind Buddy</button>`;

  if (haveCheckedIn) {
    headerColor = 'rgba(0,0,0,.03)';
    checkInBtnText = "Check-In Again";
  }

  return `<div class="card" id='${challenge.uid}'>
    <div class="card-header" id="heading${i}" style="background-color:${headerColor}">
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
          <button type="button" class="btn btn-primary" onclick="setCheckInChallenge('${challenge.uid}');" data-toggle="modal" data-target="#checkInModal">${checkInBtnText}</button>
          ${remindBuddyBtn}
          <button type="button" class="btn btn-outline-secondary" onclick="goToChallengeDetails('${challenge.uid}');">Challenge Details</button>
        </p>
      </div>
    </div>
  </div>`;
}


// Send a reminder to the buddy specified by buddyUID
function sendReminder(challengeTitle, buddyUID) {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  let reminder = `${getCurrentDate()} ${getCurrentTime()}: ${currentUser.displayName} sent you a reminder to check-in for ${challengeTitle}`;

  database.ref('users/' + buddyUID + '/reminders').once('value', (snapshot) => {
    let reminders = [];
    if (snapshot && snapshot.val()) {
      reminders = snapshot.val();
    }

    reminders.push(reminder);
    database.ref('users/' + buddyUID + '/reminders').update(reminders);
  });
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


function displayReminders() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  database.ref('users/' + currentUser.uid + "/reminders").on('value', (snapshot) => {
    if (!snapshot || !snapshot.val()) {
      $("#remindersListGroup").append(`<li class="list-group-item">No Reminders to Display</li>`);
    } else {
      let reminders = snapshot.val();
      reminders.slice().reverse().forEach((reminder, i) => {
        $("#remindersListGroup").append(`<li class="list-group-item">${reminder}</li>`);
      })
   }
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

  // Get form input
  let description = $('#description').val();
  let location = {
    'latitude': $('#latitude').val(),
    'longitude': $('#longitude').val()
  };
  let photoURL = "someURL";
  let checkInTime = getCurrentTime();
  let date = getCurrentDate();

  let update = {
    participantName: currentUser.displayName,
    checkInTime: checkInTime,
    description: description,
    photoURL: photoURL,
    location: location,
  };

  //code for updating user money
  var cost = [];
  var otherUsers = [];
  var needToUpdateBalance = false;
  database.ref('challenges/' + challengeUID).once('value').then(function(snapshot) {
    let challenge = snapshot.val();
    cost = snapshot.val().cost;

    let users = Object.values(snapshot.val().participants);
    for (const user of users) {
      if (user != currentUser.uid) {
        otherUsers.push(user);
      }
    }

    // Check if there's already a check-in from currentUser
    if (!challenge.hasOwnProperty('checkIns')) {
      needToUpdateBalance = true;
    } else if (!challenge.checkIns.hasOwnProperty(getCurrentDate())) {
      needToUpdateBalance = true;
    } else if (!challenge.checkIns[getCurrentDate()].hasOwnProperty(currentUser.uid)) {
      needToUpdateBalance = true;
    }

    if (currentImage.file) {
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
          update.photoURL = downloadURL;
          database.ref('challenges/' + challengeUID + '/checkIns/' + date + '/' + currentUser.uid).update(update);
          currentImage = {};
          if (needToUpdateBalance) {
            updateBalancesOnCheckIn(cost, otherUsers);
          }
          // Weird jQuery conflict to prevent using modal method
          $('#closeCheckInModal').trigger('click');
          $("#" + challengeUID).children(":first-child").css("background-color", 'rgba(0,0,0,.03)');
        });
      }); // End of Storage uploadTask state_changed handling

    // No photo was uploaded
    } else {
      database.ref('challenges/' + challengeUID + '/checkIns/' + date + '/' + currentUser.uid).update(update);
      if (needToUpdateBalance) {
        updateBalancesOnCheckIn(cost, otherUsers);
      }
      // Weird jQuery conflict to prevent using modal method
      $('#closeCheckInModal').trigger('click');
      $("#" + challengeUID).children(":first-child").css("background-color", 'rgba(0,0,0,.03)');
    }
  });
}


// Gets time in HH:DD in correct format for database
function getCurrentTime() {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  // TODO: FIX, IT'S HACKY
  let checkInTime = localISOTime.slice(localISOTime.indexOf("T") + 1, localISOTime.indexOf(":") + 3);
  return checkInTime;
}


// Gets date in YYYY-MM-DD in correct format for database
function getCurrentDate() {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  // TODO: FIX, IT'S HACKY
  let checkInDate = localISOTime.slice(0, localISOTime.indexOf("T"));
  return checkInDate;
}


// Update balances when a user submits a check-in
function updateBalancesOnCheckIn(cost, otherUsers) {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

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
}


function clearAllReminders(snapshot) {
  // Clear list of reminders
  $("#remindersListGroup").html("");
  $("#remindersListGroup").append(`<li class="list-group-item">No Reminders to Display</li>`);


  // Clear the reminders from the database
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();
  database.ref('users/' + currentUser.uid + '/reminders').remove();
}


function goToChallengeDetails(challengeUID) {
  window.location.href = 'challenges.html?challenge=' + challengeUID;
}


$(document).ready(() => {
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
