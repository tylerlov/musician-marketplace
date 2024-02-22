import React from "react";
import ListingItem from "../components/ListingItem";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase.config";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { ReactComponent as HomeIcon } from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);

  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
      );
      // console.log(auth.currentUser.uid)
      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //Update name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //Update name in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast("Error updating profile");
    }
  };
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "listings", listingId));
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId,
        );
        setListings(updatedListings);
        toast.success("Listing deleted");
      } catch (error) {
        toast.error("Error deleting listing");
      }
    }
  };

  const onEdit = (listingId) => {
    navigate(`/editlisting/${listingId}`);
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      //Allows us to dynamically change the name of the input - e.g. email, password
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="prageHeaderText">Profile - {email}</p>

          <button type="button" className="logOut" onClick={onLogout}>
            Log Out
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Profile Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                // Clever way to toggle onSubmit function - doesnt happen every click
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="text"
                id="name"
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>

          <Link to="/createlisting" className="createListing">
            <HomeIcon alt="home" className="createListingIcon" />
            <p>Sell or rent your instrument</p>
            <ArrowRightIcon alt="arrowRight" className="arrowRight" />
          </Link>

          {!loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;
