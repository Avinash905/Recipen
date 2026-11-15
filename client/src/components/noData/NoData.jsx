import P from "prop-types";

const NoData = ({ text }) => {
  return (
    <div className="text-4xl font-bold text-gray-300 text-center">
      No {text} Found
    </div>
  );
};

NoData.propTypes = { text: P.string };

export default NoData;
