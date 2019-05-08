$(document).ready(() => {
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});
