$(document).ready(() => {
  $('#searchFriendsBtn').click(() => {
    $.ajax({
        url: 'users',
        type: 'GET',
        dataType : 'json',
        success: (data) => {
          console.log("data", data);
          $("#users").html(data.join(", "));
        },
      });
  });

  // define a generic Ajax error handler:
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
}); // End of document.ready
