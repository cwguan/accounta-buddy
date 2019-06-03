# Team: Accounta-Buddy
## Team Members
- Christopher Guan
- Steven Phung
- Jerry Shu
- Nathan Werrede

## Team Member Contributions

**Christopher Guan**
- Created and updated schema.js to ensure everybody developing knew how to retrieve data
- Explained how Firebase works to teach teammates about how to retrieve, update, and change data from the database
- Implemented and designed dashboard so that it displays all of your current challenges and reminders that update in real-time when your buddies remind you to complete your check-in
- Implemented check-in functionality so that the user can get and save their current location, photo, and text description in our back-end
- Implemented the create a challenge functionality so that a user can create a challenge, save it in our database, and have the challenge appear in both the user and the user’s buddy current challenges
- Contributed to write-ups and original design and concept of the app
- Drew up storyboards for the original design phase

**Steven Phung**
- Developed original concept
- Wrote up concept and everything there is to it as well and showing feasibility of what's achievable for this
- Created mockups and digital conceptualizations of webapp
- Conceptually added improvements and features
- Conducted User Testing
- Contributed to writeups
- Set goals for milestones
- Helped refine UI for displaying photos for evidence and locations
- Created style guide and Logo

**Jerry Shu**

- Set up Firebase functionality on the app
- Wrote code for the app, primarily on login and challenges pages
- Grabbed data from live Firebase database and displayed it on challenges page to show history of check-ins
- Added different style changes to the app, changing some cards into expandables to reduce clutter-
- Contributed to writeups and original design and concept of the app
- Drew up storyboards for the original design phase

**Nathan Werrede**
 
 - Contributed to implementation of the check-in feed 
 - Wrote code for adding balance in the add funds page
 - Assisted with style tweaks when necessary
 - Implemented Google Maps API into check-in feed to present a map of the check-in's current location
 - Contributed to writeups and original design and concept of the app
 - Created prototypes of pages and actions during original design phase
 - Contributed to UI improvements 
 
 
 
## Source Code Files

- challenges.html
  - Detailed view of a specific challenge. When clicking on the details button on the main dashboard for a specific challenge, the user is brought to this page. On this page they can see specific details for the challenge, as well as a feed for all of the check-ins between them and their Accountabuddy. Draws data from the Firebase database and displays it on the page. Additionally, also uses the location data from the database to create a visualization using Google Maps API.
- challenges.js
  - Javascript file for the challenges page in charge of displaying all the information on the page after retrieving it from the database. It is also in charge of shrinking and expanding the different cards. It also includes the functionality to be able to end a challenge.
- createchallenge.html
  - Page for setting up a new challenge with a buddy. This page includes a lookup to the database to see all the other users’ emails. It allows for multiple different options that are written to the database and set up a challenge, such as the name, details, cost and deadline during each day.
- createchallenge.js
  - The javascript file for the challenge creation page. Hits the database to retrieve user emails to help user add a buddy as well as writing new challenges to the database using this file’s’ functions. Updates the users and their buddy’s info in the database as well.
- dashboard.html
  - The main page for the app after logging in. This page is redirected to whenever the logo and name are clicked on the navbar. This page displays all current challenges for a user, with expanding view for details, checking in, sending reminders and advanced history and details for the specific challenge. It also includes active reminders sent by buddies that are in open contracts with the user. There is also a dummy activity feed to show other users’ activity.
- dashboard.js
  - The javascript functions for the dashboard page. These include the displays for the reminders as well as all of the involved challenges. It implements all of the functionality needed to fill out and submit a check-in, remind a buddy about a challenge, and go to a challenge’s details.
- funds.html
  - This is the page where users add funds to their account. After adding funds, it displays the current balance after adding funds by retrieving it from the database.
- funds.js
  - Javascript file in charge of functions on funds page that interacts with the database, changes the funds for the user, and updates the HTML to display the new balance.
- login.html
  - This is the login page that connects the user to the app using Firebase auth. Each account has its own entry in the database storing their challenges and funds. It has all of the functionality to check if the user already exists, creating database information, and redirecting to the dashboard.
- schema.js
  - This file serves as the source of truth of our data is organized in the database. Because each of the pages in the app need to retrieve some form of data, it was important during development that we all knew at any point how to retrieve it. schema.js informed us of not only the path/structure to each piece of data but their types as well.
- settings.html
  - This is the settings page where the user can modify their account by changing their password.
- settings.js
  - Javascript file in charge of functions on settings page. This file validates the current password is correct, the new passwords match, and updating a user’s account in Firebase Authentication to be the new password.
- common.js
  - The functionalities implemented in this file are code that we found to be used and duplicated in multiple files across our app. Thus, we decided it would make much more sense to consolidate all of these features into one JavaScript file. These include configuring our Firebase project with the right API keys and other helper methods such as retrieving the date and time in a format consistent throughout the entire application.
- maps.js
  - Javascript file in charge of taking location data and displaying it on a map using google maps API for the challenge details page.

## Presentation Link

[https://docs.google.com/presentation/d/1PxnX8FuCqUlW6yn9LSbm_ECKFXjpEOG6tp1_NAngTc0/edit?usp=sharing](https://docs.google.com/presentation/d/1PxnX8FuCqUlW6yn9LSbm_ECKFXjpEOG6tp1_NAngTc0/edit?usp=sharing)

## Demo Video Link

[https://www.youtube.com/watch?v=epaEriOMrfc&feature=youtu.be](https://www.youtube.com/watch?v=epaEriOMrfc&feature=youtu.be)

