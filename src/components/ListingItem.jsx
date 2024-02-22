import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

//Listing item takes in a couple props, here we destructure them
function ListingItem({ listing, id, onDelete, onEdit }) {
  const defaultImageUrl =
    "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=1024x1024&w=is&k=20&c=Bs1RdueQnaAcO888WBIQsC6NvA7aVTzeRVzSd8sJfUg="; // Placeholder image URL
  const imageUrl =
    listing.imageUrls && listing.imageUrls[0]
      ? listing.imageUrls[0]
      : defaultImageUrl;

  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img src={imageUrl} alt={listing.name} className="categoryListingImg" />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingPrice">
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " per month" : ""}
          </p>
          <div className="categoryListingInfoDiv">
            {/* Update the icons and text to reflect "Verified" and "Pickup Only" */}
            <p className="categoryListingInfoText">
              {listing.verified ? `Verified` : `Not Verified`}
            </p>
            <p className="categoryListingInfoText">
              {listing.pickupOnly ? `Pickup Only` : `Delivery Available`}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="#2c2c2c"
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
      {onEdit && (
        <EditIcon
          className="editIcon"
          fill="#2c2c2c"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}

export default ListingItem;
