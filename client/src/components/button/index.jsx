import React from "react";
import { motion } from "framer-motion";

const index = ({
  content,
  customCss,
  type = "button",
  handleClick = null,
  icon = null,
}) => {
  return (
    <motion.button
      type={type}
      className={`bg-primaryLight hover:bg-primary text-light py-2 px-5 shadow-lg font-semibold flex items-center justify-center gap-2 text-center ${customCss}`}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      {content}
      {icon}
    </motion.button>
  );
};

export default index;
