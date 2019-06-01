initApp = function() {
 firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
     console.log("logged in");
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


function changePassword() {
    let currentPassword = $('#currentPassword').val();
    let newPassword = $('#newPassword').val();
    let confirmPassword = $('#confirmPassword').val();
    let errorMessage = $("#error-messages");
    let user = firebase.auth().currentUser;
    user.reauthenticateAndRetrieveDataWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)).then( () =>
    {
        console.log("Authenticated");
        if(newPassword === confirmPassword)
        {
            user.updatePassword(newPassword).then(() =>
            {
                console.log("Password updated!");
                errorMessage.html("Password Changed!");
            }).catch((error) => { console.log(error); errorMessage.html(error.message)});
        }
        else
        {
            errorMessage.html("New and Confirm passwords did not match")
        }
    }).catch((error) => { console.log(error); errorMessage.html(error.message);});;
}
