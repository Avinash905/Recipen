import React from "react";

const NoData = ({ text }) => {
  return (
    <div className="text-4xl font-bold text-gray-300 text-center">
      No {text} Found
    </div>
  );
};

export default NoData;
