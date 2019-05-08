const express = require('express');
const app = express();

app.use(express.static('static_files'));

/* ====== FAKE DATABASE ====== */
// Users database based off their uid (will likely get uid from Firebase Auth)
const fakeUsersDatabase = {
  '1': {name: 'Chris', balance: 123, challenges: ['challenge1uid', 'challenge2uid']},
  '2': {name: 'Jerry', balance: 456, challenges: ['challenge1uid', 'challenge2uiid']},
  '3': {name: 'Nathan', balance: 789, challenges: ['challenge3uid']},
  '4': {name: 'Steven', balance: 1234, challenges: ['challenge3uid']}
};

// Will need some kind of uid for each challenge to identify them in the database
// TODO: Figure out uid for challenge
// TODO: Check-in time format
const fakeChallengesDatabase = {
  'challenge1uid': {
    participants: ['1', '2'],
    participantNames: ['Chris', 'Jerry'],
    title: 'Workout',
    description: 'Each person will get a workout in everyday',
    cost: 2,
    checkInTime: '10:00pm',
    checkIns: {
      'April 30th': {
        '1': {
          description: "Hit a new PR, going up tomorrow!",
          photoURL: "Some link to photo in our database for participant 1",
          location: "GPS coordinates OR NA depending on challenge"
        },
        '2': {
          description: "Legs super sore from hiking, wasn't a good leg day",
          photoURL: "Some link to photo in our database for particpant 2",
          location: "GPS coordinates OR NA depending on challenge"
        }
      },
      'May 1st': {
        '1': {
          description: "new weight felt good, going to stick with it",
          photoURL: "Some link to photo in our database for participant 1",
          location: "GPS coordinates OR NA depending on challenge"
        },
        '2': {
          description: "Stretching and icing legs helped, legs feel back to normal",
          photoURL: "Some link to photo in our database for particpant 2",
          location: "GPS coordinates OR NA depending on challenge"
        }
      }
    }
  },
  'challenge2uid': {
    participants: ['1', '2'],
    participantNames: ['Chris', 'Jerry'],
    title: 'Create a Meme',
    description: 'Create and send the other person a new dank meme',
    cost: 2,
    checkInTime: '5:00pm',
    checkIns: {
      'April 30th': {
        '1': {
          description: "here's my meme",
          photoURL: "Some link to photo in our database for participant 1",
          location: "GPS coordinates OR NA depending on challenge"
        },
        '2': {
          description: "such meme wow",
          photoURL: "Some link to photo in our database for particpant 2",
          location: "GPS coordinates OR NA depending on challenge"
        }
      }
    }
  },
  'challenge3uid': {
    participants: ['3', '4'],
    participantNames: ['Nathan', 'Steven'],
    title: 'Sleep 8 hours',
    description: 'Each person will sleep around 8 hours. Might be useful to provide sleep and wake times',
    cost: 5,
    checkInTime: '11:00am',
    checkIns: {
      'April 30th': {
        '3': {
          description: "Got 7.5 hours, feel great",
          photoURL: "Some link to photo in our database for participant 3",
          location: "GPS coordinates OR NA depending on challenge"
        },
        '4': {
          description: "scaaaaary ass dream last night, don't feel nice",
          photoURL: "Some link to photo in our database for particpant 4",
          location: "GPS coordinates OR NA depending on challenge"
        }
      }
    }
  },
};


/* ====== ENDPOINTS ====== */
// Gets a name of all of the users in the database
app.get('/users', (req, res) => {
  const allUserUIDs = Object.keys(fakeUsersDatabase); // returns a list of object keys
  const allUserNames = [];
  allUserUIDs.forEach((user) => {
    console.log(user, ':', fakeUsersDatabase[user].name);
    allUserNames.push(fakeUsersDatabase[user].name);
  });
  res.send(allUserNames);
});


// Get info about one user including their name, balance, challenges in
app.get('/users/:userid', (req, res) => {
  const nameToLookup = req.params.userid; // matches ':userid' above
  const val = fakeUsersDatabase[nameToLookup];
  console.log(nameToLookup, '->', val); // for debugging
  if (val) {
    res.send(val);
  } else {
    res.send({}); // failed, so return an empty object instead of undefined
  }
});


// Gets a list of all of the challenge's uids
app.get('/challenges', (req, res) => {
  const allChallengesUID = Object.keys(fakeChallengesDatabase);
  console.log(allChallengesUID);
  res.send(allChallengesUID);
});


// Gets all of the challenges a user participates in and each challenges' info
app.get('/challenges/:userid', (req, res) => {
  const userToLookup = req.params.userid;
  const user = fakeUsersDatabase[userToLookup];
  if (user) {
    const challengesInfo = {};
    user.challenges.forEach((challenge) => {
      challengesInfo[challenge] = fakeChallengesDatabase[challenge];
    });
    console.log(challengesInfo);
    res.send(challengesInfo);
  } else {
    console.log("User with uid", userToLookup, "not found");
    res.send({});
  }
});


// Default redirect to the login page when page is not specified
app.get('/', function(req, res){
    res.sendfile('static_files/login.html');
});

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
