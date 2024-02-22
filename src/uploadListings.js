var admin = require("firebase-admin");
var serviceAccount = require("../resources/adminsdk-ju409-85feecaf6a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase initialized");

var fs = require("fs");
var db = admin.firestore(); // Get a Firestore reference

// Function to delete all documents in the 'listings' collection
function deleteAllListings() {
  db.collection("listings")
    .get()
    .then((snapshot) => {
      // Delete documents in batches
      const batchSize = snapshot.size;
      if (batchSize === 0) {
        // Collection is empty
        return;
      }
      // Delete documents
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      console.log("All listings deleted successfully");
      uploadListings(); // Proceed to upload new listings
    })
    .catch((error) => {
      console.error("Error deleting listings: ", error);
    });
}

// Function to upload listings from JSON file
function uploadListings() {
  fs.readFile("../resources/listings.json", "utf8", function (err, data) {
    if (err) throw err;
    console.log("File read successfully");
    var listings = JSON.parse(data).listings;

    listings.forEach(function (listing) {
      console.log("Adding listing: ", listing);
      db.collection("listings")
        .add(listing)
        .then((docRef) => {
          console.log("Listing added successfully with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding listing: ", error);
        });
    });
  });
}

// Start the process by deleting all listings first
deleteAllListings();
