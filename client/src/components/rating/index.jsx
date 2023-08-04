import React from "react";
import { Rating } from "react-simple-star-rating";

const index = ({ readOnly, size = 30, rating = 0 }) => {
  return (
    <div className="flex">
      <Rating
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

export default index;
