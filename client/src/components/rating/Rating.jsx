import React from "react";
import { Rating as MuiRating } from "react-simple-star-rating";

const Rating = ({ readOnly, size = 30, rating = 0 }) => {
  return (
    <div className="flex">
      <MuiRating
        initialValue={rating}
        size={size}
        transition
        allowFraction
        readonly={readOnly}
        emptyStyle={{ display: "flex" }}
        fillStyle={{ display: "-webkit-inline-box" }}
      />
    </div>
  );
};

export default Rating;
