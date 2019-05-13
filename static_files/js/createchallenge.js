// TODO PROBABLY A BETTER WAY TO DO THIS
let emailToUID = {};

function preparePage() {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  // TODO CHANGE AND MAKE THIS MORE EFFICIENT
  database.ref('users/').once('value').then(function(snapshot) {
    let users = snapshot.val();
    console.log(users);
    let usersList = [];

    for (const userKey in users) {
      let user = users[userKey];
      if (user.uid != currentUser.uid) {
        emailToUID[user.email] = user.uid;
        usersList.push(`${user.name} (${user.email})`);
      }
    }

    $("#users").html(usersList.join(", "));
  });
}


function onCreateChallenge() {
  console.log('In onCreateChallenge');
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  let buddyUID = emailToUID[$('#findMembers').val()];
  let title = $('#title').val();
  let description = $('#challengeDetails').val();
  let cost = $('#cost').val();
  let checkInDeadline = $('#checkInDeadline').val();

  let participants = [currentUser.uid, buddyUID];

  database.ref('users/' + buddyUID).once('value').then(function(snapshot) {
    let buddy = snapshot.val();

    let participantNames = [currentUser.displayName, buddy.name];

    let newChallengeKey = database.ref().child('challenges').push().key;
    let challenge = {
      checkInDeadline: checkInDeadline,
      cost: cost,
      description: description,
      participants: participants,
      participantNames: participantNames,
      title: title,
      uid: newChallengeKey
    };

    console.log('New Challenge:', challenge);

    let buddyChallengeList = buddy.challenges;
    if (buddyChallengeList)  {
      buddyChallengeList.push(newChallengeKey);
    } else {
      buddyChallengeList = [newChallengeKey];
    }

    buddy.challenges = buddyChallengeList

    let updates = {};
    updates['users/' + buddyUID] = buddy;
    updates['challenges/' + newChallengeKey] = challenge;

    database.ref().update(updates);
    updateCurrentUserChallengeList(newChallengeKey);
  });
}


function updateCurrentUserChallengeList(newChallengeKey) {
  let currentUser = firebase.auth().currentUser;
  let database = firebase.database();

  database.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
    let user = snapshot.val();

    let userChallengeList = user.challenges;
    if (userChallengeList)  {
      userChallengeList.push(newChallengeKey);
    } else {
      userChallengeList = [newChallengeKey];
    }

    user.challenges = userChallengeList;

    database.ref('users/' + user.uid).update(user);
  });
}




$(document).ready(() => {
  // $('#searchFriendsBtn').click(() => {
  //   $.ajax({
  //       url: 'users',
  //       type: 'GET',
  //       dataType : 'json',
  //       success: (data) => {
  //         console.log("data", data);
  //         $("#users").html(data.join(", "));
  //       },
  //     });
  // });
  // });

  // define a generic Ajax error handler:
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
