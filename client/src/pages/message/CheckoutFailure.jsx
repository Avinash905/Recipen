import React from "react";
import { paymentFailed } from "../../assets";
import Message from "./Message";

const CheckoutFailure = () => {
  return (
    <Message
      animation={paymentFailed}
      loop={false}
    />
  );
};

export default CheckoutFailure;
