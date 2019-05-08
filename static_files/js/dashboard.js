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
        <p>Particpants: ${challenge.participantNames.join(", ")}</p>
        <p>Cost: ${challenge.cost} Accounta-Bux</p>
        <p>Check-In Time: ${challenge.checkInTime} </p>
      </div>
    </div>
  </div>`;
}


$(document).ready(() => {
  // TODO Currently pretending Chris (uid:1) is logged in, will need to update current logged in user
  $.ajax({
      url: 'challenges/1',
      type: 'GET',
      dataType : 'json',
      success: (data) => {
        console.log('Received challenges for user 1');
        const dataKeys = Object.keys(data);
        dataKeys.forEach((challenge, i) => {
          $('#currentChallenges').append(createChallengeView(data[challenge], i));
        });
      },
    });

  // define a generic Ajax error handler:
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
