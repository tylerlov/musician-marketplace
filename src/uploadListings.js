var admin = require("firebase-admin");

var serviceAccount = require("../resources/adminsdk-ju409-85feecaf6a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://house-marketplace-app-cc82d.firebaseapp.com"
});

console.log("Firebase initialized");

var fs = require('fs');

fs.readFile('../resources/listings.json', 'utf8', function (err, data) {
  if (err) throw err;
  console.log("File read successfully");
  var listings = JSON.parse(data).listings;

  listings.forEach(function(listing) {
    console.log("Pushing listing: ", listing);
    admin.database().ref('listings').push(listing)
      .then((ref) => {
        console.log("Listing pushed successfully with reference: ", ref.key);
      })
      .catch((error) => {
        console.error("Error pushing listing: ", error);
      });
  });
});